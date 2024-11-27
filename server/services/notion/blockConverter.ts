import type { NotionBlock, NotionClientInterface } from '@/types/notion'
import { NotionToMarkdown } from 'notion-to-md'

type image = {
  url: string, 
  alt: string
}

export async function convertBlocksToMarkdown(notionClient: NotionClientInterface, blocks: NotionBlock[]): Promise<{ markdownContent: string; images: image[]} > {
  const n2m = new NotionToMarkdown({ notionClient });

  const images: { url: string; alt: string }[] = []
  
  // Custom transformer - Images (check alt text and webp building later)
  n2m.setCustomTransformer("image", async (block: any) => {
    const imageUrl = block.image?.file?.url || block.image?.external?.url || ''
    const altText = block.image?.caption?.[0]?.plain_text

    if (!altText || altText.trim() === '')
      throw new Error(`Image without alt text detected: ${imageUrl}`)

    images.push({ url: imageUrl, alt: altText })
    return `![${altText}](${imageUrl})`
  });

  const markdownContent = await Promise.all(blocks.map((block) => {
    return n2m.blockToMarkdown(block as any);
  })).then(md => md.join('\n\n'))

  return { markdownContent, images }
}
