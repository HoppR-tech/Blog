import type { NotionClientInterface } from '@/types/notion'
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { NotionToMarkdown } from 'notion-to-md'

type image = {
  url: string,
  alt: string
}

export async function convertBlocksToMarkdown(notionClient: NotionClientInterface, blocks: BlockObjectResponse[]): Promise<{ markdownContent: string; images: image[]} > {
  const n2m = new NotionToMarkdown({ notionClient });
  const images: { url: string; alt: string }[] = [];

  try {
    console.log(`Starting conversion of ${blocks.length} blocks`);

    // Traiter les blocs par lots pour éviter les timeouts
    const BATCH_SIZE = 50;
    const markdownBlocks = [];

    for (let i = 0; i < blocks.length; i += BATCH_SIZE) {
      const batch = blocks.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(batch.map(async (block, index) => {
        try {
          const md = await n2m.blockToMarkdown(block as any);
          const globalIndex = i + index;
          console.log(`Successfully converted block ${globalIndex + 1}/${blocks.length}`);

          // Capturer les images si présentes
          if (block.type === 'image') {
            const imageBlock = block as any;
            const imageUrl = imageBlock.image?.external?.url || imageBlock.image?.file?.url;
            const imageAlt = imageBlock.image?.caption?.[0]?.plain_text || '';

            // Throw an error if image has no alt text
            if (!imageAlt && imageUrl) {
              throw new Error(`Image without alt text detected: ${imageUrl}`);
            }

            images.push({
              url: imageUrl,
              alt: imageAlt
            });
          }

          return md;
        } catch (error) {
          console.error(`Error converting block ${i + index + 1}:`, error);
          return '';
        }
      }));

      markdownBlocks.push(...batchResults);
    }

    const markdownContent = markdownBlocks.join('\n\n');

    console.log(`Conversion completed. Generated ${markdownContent.length} characters`);
    console.log(`Found ${images.length} images`);

    return { markdownContent, images };
  } catch (error) {
    console.error('Error in convertBlocksToMarkdown:', error);
    throw error;
  }
}
