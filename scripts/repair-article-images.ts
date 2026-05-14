/**
 * One-shot repair script for an article whose inline images point to expired Notion S3 URLs.
 *
 * What it does:
 *  - Queries the Notion database for the page matching the given title.
 *  - Re-fetches the blocks (which returns fresh signed image URLs).
 *  - Downloads the images, converts them to webp.
 *  - Writes them locally into content/blogs/<folder>/assets/.
 *  - Rewrites content/blogs/<folder>/index.md so the markdown points at the local assets.
 *
 * Usage:
 *   bun run scripts/repair-article-images.ts "<article title substring>" "<folder name>"
 *
 * Example:
 *   bun run scripts/repair-article-images.ts \
 *     "Docker, volumes et perte de données" \
 *     "2026-04-20-docker-volumes-et-perte-de-donnees-pourquoi-vos-donnees-disparaissent"
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { Client } from '@notionhq/client'
import axios from 'axios'
import sharp from 'sharp'

const NOTION_API_KEY = process.env.NUXT_NOTION_API_KEY || process.env.NOTION_API_KEY
const DATABASE_POSTS_ID = process.env.NUXT_NOTION_DATABASE_POSTS_ID || process.env.NOTION_DATABASE_POSTS_ID

if (!NOTION_API_KEY || !DATABASE_POSTS_ID) {
  console.error('NUXT_NOTION_API_KEY and NUXT_NOTION_DATABASE_POSTS_ID must be set (check .env).')
  process.exit(1)
}

const [, , titleQuery, folderName] = process.argv
if (!titleQuery || !folderName) {
  console.error('Usage: bun run scripts/repair-article-images.ts "<title substring>" "<folder name>"')
  process.exit(1)
}

const articleDir = path.resolve(process.cwd(), 'content/blogs', folderName)
const assetsDir = path.join(articleDir, 'assets')
const indexPath = path.join(articleDir, 'index.md')

async function main() {
  await fs.access(indexPath)

  const notion = new Client({ auth: NOTION_API_KEY })

  console.log(`[1/5] Finding Notion page with title matching: "${titleQuery}"`)
  const database: any = await notion.databases.retrieve({ database_id: DATABASE_POSTS_ID! })
  const dataSourceId: string = database.data_sources?.[0]?.id
  if (!dataSourceId)
    throw new Error('No data source on the Notion database.')

  const query: any = await (notion as any).dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: 'Articles',
      title: { contains: titleQuery },
    },
    page_size: 5,
  })

  if (query.results.length === 0)
    throw new Error(`No Notion page matches "${titleQuery}".`)
  if (query.results.length > 1)
    console.warn(`Warning: ${query.results.length} pages matched. Using the first.`)

  const pageId = query.results[0].id
  console.log(`   → page id: ${pageId}`)

  console.log(`[2/5] Fetching blocks and their fresh image URLs`)
  const imageUrls: { url: string, caption: string }[] = []
  let cursor: string | undefined
  do {
    const response: any = await notion.blocks.children.list({ block_id: pageId, start_cursor: cursor, page_size: 100 })
    for (const block of response.results as any[]) {
      if (block.type === 'image') {
        const url = block.image?.file?.url || block.image?.external?.url
        const caption = block.image?.caption?.[0]?.plain_text || ''
        if (url)
          imageUrls.push({ url, caption })
      }
    }
    cursor = response.has_more ? response.next_cursor : undefined
  } while (cursor)

  if (imageUrls.length === 0)
    throw new Error('No image blocks found in the Notion page.')

  console.log(`   → found ${imageUrls.length} inline image blocks`)

  console.log(`[3/5] Downloading and converting images`)
  await fs.mkdir(assetsDir, { recursive: true })

  const downloads = await Promise.all(imageUrls.map(async (entry, i) => {
    const localName = `img${i + 1}.webp`
    const response = await axios.get(entry.url, { responseType: 'arraybuffer' })
    // Aligné sur le pipeline principal (server/services/notion/imageUtils.ts) :
    // 1000px = 2x retina pour un affichage max 500px côté blog.
    const webpBuffer = await sharp(response.data)
      .resize({ width: 1000, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
    await fs.writeFile(path.join(assetsDir, localName), webpBuffer)
    console.log(`   → saved ${localName} (caption: "${entry.caption.slice(0, 60)}${entry.caption.length > 60 ? '…' : ''}")`)
    return { caption: entry.caption, localName }
  }))

  console.log(`[4/6] Rewriting index.md to point at ./assets/imgN.webp`)
  let markdown = await fs.readFile(indexPath, 'utf-8')

  const notionImageRegex = /!\[([^\]]*)\]\(https:\/\/prod-files-secure\.s3[^)]+\)/g
  let matchCount = 0
  markdown = markdown.replace(notionImageRegex, (_full, altText: string) => {
    const match = downloads.find(d => d.caption && altText.trim() === d.caption.trim())
      || downloads[matchCount]
    matchCount++
    if (!match)
      throw new Error(`Unable to find downloaded image for alt text: ${altText.slice(0, 80)}`)
    return `![${altText}](./assets/${match.localName})`
  })

  console.log(`   → replaced ${matchCount} inline image references`)

  console.log(`[5/6] Repairing reviewer/author avatars pointing at expired Notion URLs`)
  const personBlockRegex = /(?<indent> {2,})- id: (?<id>[^\n]+)\n(?<body>(?:\k<indent> {2}[^\n]*\n)*)/g
  const imageLineRegex = /(?<imgIndent> {2,}image: )(https:\/\/prod-files-secure\.s3[^\n]+)/
  const replacements: { oldLine: string, newLine: string }[] = []

  for (const match of markdown.matchAll(personBlockRegex)) {
    const body = match.groups?.body ?? ''
    const personId = match.groups?.id?.trim()
    const imgMatch = body.match(imageLineRegex)
    if (!imgMatch || !personId)
      continue

    console.log(`   → fetching fresh avatar for person id ${personId}`)
    const personPage: any = await notion.pages.retrieve({ page_id: personId })
    const freshUrl: string = personPage?.properties?.Avatar?.files?.[0]?.file?.url
      || personPage?.properties?.Avatar?.files?.[0]?.external?.url
    const personName: string = personPage?.properties?.Name?.title?.[0]?.plain_text || personId
    if (!freshUrl) {
      console.warn(`     ⚠️  no avatar found in Notion for ${personName}`)
      continue
    }

    const slug = personName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036F]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const localName = `reviewer-${slug}.webp`
    const response = await axios.get(freshUrl, { responseType: 'arraybuffer' })
    // 256px = 4x retina pour un affichage 64-128px (coh\u00E9rent avec AVATAR_IMAGE_MAX_WIDTH
    // dans server/services/notion/imageUtils.ts).
    const webpBuffer = await sharp(response.data)
      .resize({ width: 256, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
    await fs.writeFile(path.join(assetsDir, localName), webpBuffer)
    console.log(`     → saved ${localName}`)

    const oldLine = imgMatch[0]
    const newLine = `${imgMatch.groups?.imgIndent ?? '    image: '}./assets/${localName}`
    replacements.push({ oldLine, newLine })
  }

  for (const { oldLine, newLine } of replacements)
    markdown = markdown.replace(oldLine, newLine)

  await fs.writeFile(indexPath, markdown)

  console.log(`[6/6] Done. Review content/blogs/${folderName}/ and commit the changes.`)
}

main().catch((err) => {
  console.error('Repair failed:', err)
  process.exit(1)
})
