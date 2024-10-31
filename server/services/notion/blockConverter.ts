import type { NotionBlock } from '@/types/notion'

function extractText(blockContent: any): string {
  return blockContent?.rich_text.map((text: any) => {
    let content = text.plain_text

    // Appliquer les styles dans un ordre spécifique pour éviter les conflits
    if (text.annotations?.bold)
      content = `**${content}**`
    if (text.annotations?.italic)
      content = `*${content}*`
    if (text.annotations?.strikethrough)
      content = `~~${content}~~`
    if (text.annotations?.code)
      content = `\`${content}\``
    if (text.annotations?.underline)
      content = `<u>${content}</u>`

    // Appliquer le lien si présent
    if (text.href)
      return `[${content}](${text.href})`

    return content
  }).join('')
}

function codeToMarkdown(block: any): string {
  const language = block.code?.language || ''
  const code = extractText(block.code)
  return `\`\`\`${language}\n${code}\n\`\`\`\n\n`
}

export function convertBlocksToMarkdown(blocks: NotionBlock[]): { markdownContent: string; images: { url: string; alt: string }[] } {
  const images: { url: string; alt: string }[] = []
  let isFirstBlock = true
  const blockToMarkdown: { [key: string]: (block: any, index: number) => string } = {
    paragraph: (block: any) => {
      isFirstBlock = false
      return `${extractText(block.paragraph)}\n\n`
    },
    heading_1: (block: any) => {
      const heading = extractText(block.heading_1)
      if (isFirstBlock) {
        isFirstBlock = false
        return `# ${heading}\n\n`
      }
      return `## ${heading}\n\n`
    },
    heading_2: (block: any) => {
      isFirstBlock = false
      return `## ${extractText(block.heading_2)}\n\n`
    },
    heading_3: (block: any) => {
      isFirstBlock = false
      return `### ${extractText(block.heading_3)}\n\n`
    },
    bulleted_list_item: (block: any) => {
      isFirstBlock = false
      return `- ${extractText(block.bulleted_list_item)}\n`
    },
    numbered_list_item: (block: any, index: number) => {
      isFirstBlock = false
      return `${index + 1}. ${extractText(block.numbered_list_item)}\n`
    },
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

  const markdownContent = blocks.map((block, index) => {
    const result = blockToMarkdown[block.type]?.(block, index) || ''
    isFirstBlock = false
    return result
  }).join('')

  return { markdownContent, images }
}
