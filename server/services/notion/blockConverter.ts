import type { BlockObjectResponse, TableBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { EquationBlockObjectResponse, NotionClientInterface } from '@/types/notion'
import { NotionToMarkdown } from 'notion-to-md'
import { convertTableToMarkdown, isTableBlock } from './tableConverter'

interface image {
  url: string
  alt: string
}

/**
 * Raised when a Notion image block has no caption (alt text). It is rethrown
 * past the per-block catch so it aborts the whole conversion: an article with a
 * caption-less image must NOT be published, and the publish flow surfaces this
 * message to the author instead of silently dropping the image.
 */
export class MissingImageAltError extends Error {
  constructor(blockId: string) {
    super(
      `Image sans texte alternatif détectée dans Notion (bloc ${blockId}). `
      + `Ajoutez une légende (caption) à chaque image dans Notion avant de publier l'article.`,
    )
    this.name = 'MissingImageAltError'
  }
}

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

            // Every image must have alt text. Fail loudly (and abort the publish)
            // rather than dropping the image: missing alt is an accessibility
            // defect the author must fix by adding a caption in Notion.
            if (imageUrl && !imageAlt) {
              throw new MissingImageAltError(imageBlock.id ?? 'unknown')
            }

            images.push({
              url: imageUrl,
              alt: imageAlt,
            })
          }

          return md
        }
        catch (error) {
          // Accessibility errors must abort the conversion so the article is not
          // published; only genuinely block-local conversion glitches are skipped.
          if (error instanceof MissingImageAltError) {
            throw error
          }
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
