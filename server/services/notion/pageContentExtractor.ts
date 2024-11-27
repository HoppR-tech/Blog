import { convertBlocksToMarkdown } from './blockConverter'
import { getPersonsInfo } from './personInfoFetcher'
import { safeGetProperty } from './notionUtils'
import type { PageContent } from '@/types/blog'
import type { NotionClientInterface, NotionPage } from '@/types/notion'

export async function getPageContent(notionClient: NotionClientInterface, page: NotionPage): Promise<PageContent> {
  try {
    // console.error('Page reçue de Notion:', JSON.stringify(page, null, 2))
    const blocks = await notionClient.blocks.children.list({ block_id: page.id })
    const { markdownContent, images } = await convertBlocksToMarkdown(notionClient, blocks.results)

    const authorsProperty = page.properties.Auteurs as { relation?: { id: string }[] }
    const authorIds = authorsProperty?.relation?.map(author => author.id) || []
    const authors = await getPersonsInfo(notionClient, authorIds, 'Author')

    const reviewersProperty = page.properties.Relecteurs as { relation?: { id: string }[] }
    const reviewerIds = reviewersProperty?.relation?.map(reviewer => reviewer.id) || []
    const reviewers = await getPersonsInfo(notionClient, reviewerIds, 'Reviewer')

    const tags = page.properties.Tags as { multi_select?: { name: string }[] }
    const tagsNames = tags.multi_select?.map(tag => tag.name) || []

    const coverImage = safeGetProperty(page, ['properties', 'Cover Image', 'files', '0', 'file', 'url'], '')
    const coverImageAlt = safeGetProperty(page, ['properties', 'Cover Image Alt', 'rich_text', '0', 'plain_text'], '')

    return {
      notionId: page.id,
      title: extractTitleFromPage(page),
      authors,
      reviewers,
      coverImage,
      coverImageAlt,
      tags: tagsNames,
      content: markdownContent,
      images,
    }
  }
  catch (error) {
    console.error('Error while retrieving the page:', error)
    throw error
  }
}

export function extractTitleFromPage(page: NotionPage): string {
  const post = page.properties.Articles
  if (!post || !Array.isArray(post.title) || post.title.length === 0)
    throw new Error('Title property not found in page')

  const title = post.title[0].plain_text
  if (!title || title.trim() === '')
    throw new Error('Title is missing or empty')

  return title
}
