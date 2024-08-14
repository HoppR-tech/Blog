import type { NotionBlock } from '@/types/notion'

function extractText(blockContent: any): string {
  return blockContent?.rich_text.map((text: any) => text.plain_text).join('')
}

function codeToMarkdown(block: any): string {
  const language = block.code?.language || ''
  const code = extractText(block.code)
  return `\`\`\`${language}\n${code}\n\`\`\`\n\n`
}

export function convertBlocksToMarkdown(blocks: NotionBlock[]): { markdownContent: string; images: { url: string; alt: string }[] } {
  const images: { url: string; alt: string }[] = []
  const blockToMarkdown: { [key: string]: (block: any) => string } = {
    paragraph: (block: any) => `${extractText(block.paragraph)}\n\n`,
    heading_1: (block: any) => `# ${extractText(block.heading_1)}\n\n`,
    heading_2: (block: any) => `## ${extractText(block.heading_2)}\n\n`,
    heading_3: (block: any) => `### ${extractText(block.heading_3)}\n\n`,
    bulleted_list_item: (block: any) => `- ${extractText(block.bulleted_list_item)}\n`,
    numbered_list_item: (block: any) => `1. ${extractText(block.numbered_list_item)}\n`,
    code: (block: any) => codeToMarkdown(block),
    image: (block: any) => {
      const imageUrl = block.image?.file?.url || block.image?.external?.url || ''
      const altText = block.image?.caption?.[0]?.plain_text

      if (!altText || altText.trim() === '')
        throw new Error(`Image without alt text detected: ${imageUrl}`)

      images.push({ url: imageUrl, alt: altText })
      return `![${altText}](${imageUrl})\n\n`
    },
    callout: (block: any) => `> ${extractText(block.callout)}\n\n`,
    quote: (block: any) => `> ${extractText(block.quote)}\n\n`,
    divider: () => '---\n\n',
    toggle: (block: any) => `<details>\n<summary>${extractText(block.toggle)}</summary>\n\n</details>\n\n`,
  }

  const markdownContent = blocks.map(block => blockToMarkdown[block.type]?.(block) || '').join('')
  return { markdownContent, images }
}
