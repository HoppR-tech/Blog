import { describe, expect, it } from 'vitest'
import { convertBlocksToMarkdown } from './blockConverter'

describe('blockConverter', () => {
  it('should convert various block types to markdown', () => {
    const blocks = [
      { type: 'paragraph', paragraph: { rich_text: [{ plain_text: 'Hello' }] } },
      { type: 'heading_1', heading_1: { rich_text: [{ plain_text: 'Title' }] } },
      { type: 'heading_2', heading_2: { rich_text: [{ plain_text: 'Subtitle' }] } },
      { type: 'heading_3', heading_3: { rich_text: [{ plain_text: 'Section' }] } },
      { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ plain_text: 'Item 1' }] } },
      { type: 'numbered_list_item', numbered_list_item: { rich_text: [{ plain_text: 'Item 2' }] } },
      { type: 'code', code: { language: 'javascript', rich_text: [{ plain_text: 'console.log("Hello")' }] } },
      { type: 'image', image: { file: { url: 'http://example.com/image.png' }, caption: [{ plain_text: 'An image' }] } },
      { type: 'callout', callout: { rich_text: [{ plain_text: 'Note' }] } },
      { type: 'quote', quote: { rich_text: [{ plain_text: 'Famous quote' }] } },
      { type: 'divider' },
      { type: 'table_of_contents' },
      { type: 'toggle', toggle: { rich_text: [{ plain_text: 'Toggle' }] } },
    ]
    const { markdownContent, images } = convertBlocksToMarkdown(blocks)

    expect(markdownContent).toContain('Hello\n\n')
    expect(markdownContent).toContain('# Title\n\n')
    expect(markdownContent).toContain('## Subtitle\n\n')
    expect(markdownContent).toContain('### Section\n\n')
    expect(markdownContent).toContain('- Item 1\n')
    expect(markdownContent).toContain('1. Item 2\n')
    expect(markdownContent).toContain('```javascript\nconsole.log("Hello")\n```\n\n')
    expect(markdownContent).toContain('![An image](http://example.com/image.png)\n\n')
    expect(markdownContent).toContain('> Note\n\n')
    expect(markdownContent).toContain('> Famous quote\n\n')
    expect(markdownContent).toContain('---\n\n')
    expect(markdownContent).toContain('<details>\n<summary>Toggle</summary>\n\n</details>\n\n')
    expect(images).toEqual([{ url: 'http://example.com/image.png', alt: 'An image' }])
  })

  it('should convert image blocks with alt text to markdown', () => {
    const blocks = [
      {
        type: 'image',
        image: {
          file: { url: 'http://example.com/image.png' },
          caption: [{ plain_text: 'Une image avec un texte alternatif' }],
        },
      },
    ]
    const { markdownContent, images } = convertBlocksToMarkdown(blocks)

    expect(markdownContent).toContain('![Une image avec un texte alternatif](http://example.com/image.png)\n\n')
    expect(images).toEqual([{ url: 'http://example.com/image.png', alt: 'Une image avec un texte alternatif' }])
  })

  it('should throw an error for images without alt text', () => {
    const blocks = [
      {
        type: 'image',
        image: {
          file: { url: 'http://example.com/image-without-alt.png' },
          caption: [],
        },
      },
    ]

    expect(() => convertBlocksToMarkdown(blocks)).toThrow('Image without alt text detected: http://example.com/image-without-alt.png')
  })

  it('should handle empty blocks gracefully', () => {
    const blocks = [
      { type: 'paragraph', paragraph: { rich_text: [] } },
      { type: 'heading_1', heading_1: { rich_text: [] } },
    ]
    const { markdownContent, images } = convertBlocksToMarkdown(blocks)

    expect(markdownContent).toBe('\n\n# \n\n')
    expect(images).toEqual([])
  })

  it('should ignore unknown block types', () => {
    const blocks = [
      { type: 'unknown', unknown: { rich_text: [{ plain_text: 'Unknown' }] } },
    ]
    const { markdownContent, images } = convertBlocksToMarkdown(blocks)

    expect(markdownContent).toBe('')
    expect(images).toEqual([])
  })

  it('should convert paragraphs with links to markdown', () => {
    const blocks = [
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [
            { plain_text: 'Ceci est un ', href: null },
            { plain_text: 'lien', href: 'https://example.com' },
            { plain_text: ' dans un paragraphe.', href: null },
          ],
        },
      },
    ]
    const { markdownContent } = convertBlocksToMarkdown(blocks)

    expect(markdownContent).toBe('Ceci est un [lien](https://example.com) dans un paragraphe.\n\n')
  })
})
