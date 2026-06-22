import type { BlockObjectResponse, TableBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { EquationBlockObjectResponse, NotionClientInterface } from '@/types/notion'
import { NotionToMarkdown } from 'notion-to-md'
import { convertTableToMarkdown, isTableBlock } from './tableConverter'

interface image {
  url: string
  alt: string
}

// Fallback alt text for Notion images that have no caption. Keeps the image
// (and the article) accessible instead of dropping it.
const IMAGE_FALLBACK_ALT = 'Illustration de l\'article'

export async function convertBlocksToMarkdown(notionClient: NotionClientInterface, blocks: BlockObjectResponse[]): Promise<{ markdownContent: string, images: image[] }> {
  const n2m = new NotionToMarkdown({ notionClient })
  const images: { url: string, alt: string }[] = []

  // Configurer notion-to-md pour gérer les équations
  n2m.setCustomTransformer('equation', async (block) => {
    const equationBlock = block as EquationBlockObjectResponse
    return `$$\n${equationBlock.equation.expression}\n$$`
  })

  // Pour les équations en ligne
  n2m.setCustomTransformer('text', async (block: any) => {
    if (block.type === 'equation') {
      return `$${block.equation.expression}$`
    }
    if (block.annotations?.code && /^\$.*\$$/.test(block.plain_text)) {
      return block.plain_text
    }
    return block.plain_text
  })

  // Transformer personnalisé pour les tableaux
  n2m.setCustomTransformer('table', async (block) => {
    const tableBlock = block as TableBlockObjectResponse
    return await convertTableToMarkdown(tableBlock)
  })

  try {
    console.log(`Starting conversion of ${blocks.length} blocks`)

    // Traiter les blocs par lots pour éviter les timeouts
    const BATCH_SIZE = 50
    const markdownBlocks = []

    for (let i = 0; i < blocks.length; i += BATCH_SIZE) {
      const batch = blocks.slice(i, i + BATCH_SIZE)
      const batchResults = await Promise.all(batch.map(async (block, index) => {
        try {
          // Utiliser notre convertisseur personnalisé pour les tableaux
          let md
          if (isTableBlock(block)) {
            md = await convertTableToMarkdown(block as TableBlockObjectResponse)
            console.log(`Table block converted with custom converter`)
          }
          else {
            md = await n2m.blockToMarkdown(block as any)
          }

          const globalIndex = i + index
          console.log(`Successfully converted block ${globalIndex + 1}/${blocks.length}`)

          // Capturer les images si présentes
          if (block.type === 'image') {
            const imageBlock = block as any
            const imageUrl = imageBlock.image?.external?.url || imageBlock.image?.file?.url
            const imageAlt = imageBlock.image?.caption?.[0]?.plain_text?.trim() || ''

            if (imageUrl) {
              // An image without a Notion caption used to throw here; the error was
              // then swallowed by the catch below, turning the block into an empty
              // string and silently dropping the image from the published article.
              // Keep the image instead: fall back to a generic alt and warn so
              // caption-less images can be spotted and fixed in Notion.
              if (!imageAlt) {
                console.warn(`Image without caption in Notion, using fallback alt text: ${imageUrl}`)
                md = `![${IMAGE_FALLBACK_ALT}](${imageUrl})`
              }

              images.push({
                url: imageUrl,
                alt: imageAlt || IMAGE_FALLBACK_ALT,
              })
            }
          }

          return md
        }
        catch (error) {
          console.error(`Error converting block ${i + index + 1}:`, error)
          return ''
        }
      }))

      markdownBlocks.push(...batchResults)
    }

    const markdownContent = markdownBlocks.join('\n\n')

    console.log(`Conversion completed. Generated ${markdownContent.length} characters`)
    console.log(`Found ${images.length} images`)

    return { markdownContent, images }
  }
  catch (error) {
    console.error('Error in convertBlocksToMarkdown:', error)
    throw error
  }
}
