import { describe, expect, it } from 'vitest'
import { convertBlocksToMarkdown } from './blockConverter'
import { Client } from '@notionhq/client'

const mockClient = new Client({ auth: 'test-token' })

describe('blockConverter', () => {
  it('should convert various block types to markdown', async () => {
    const blocks = [
      { type: 'paragraph', paragraph: { rich_text: [{ plain_text: 'Hello', annotations: {} }] } },
      { type: 'heading_1', heading_1: { rich_text: [{ plain_text: 'Title', annotations: {} }] } },
      { type: 'heading_2', heading_2: { rich_text: [{ plain_text: 'Subtitle', annotations: {} }] } },
      { type: 'heading_3', heading_3: { rich_text: [{ plain_text: 'Section', annotations: {} }] } },
      { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ plain_text: 'Item 1', annotations: {} }] } },
      { type: 'numbered_list_item', numbered_list_item: { rich_text: [{ plain_text: 'Item 2', annotations: {} }], number: 1 } },
      { type: 'code', code: { language: 'javascript', rich_text: [{ plain_text: 'console.log("Hello")', annotations: {} }] } },
      { type: 'image', image: { file: { url: 'http://example.com/image.png' }, caption: [{ plain_text: 'An image' }] } },
      { type: 'callout', callout: { rich_text: [{ plain_text: 'Note', annotations: {} }] } },
      { type: 'quote', quote: { rich_text: [{ plain_text: 'Famous quote', annotations: {} }] } },
      { type: 'divider' },
      { type: 'table_of_contents', table_of_contents: { color: "default" } },
      { type: 'toggle', toggle: { rich_text: [{ plain_text: 'Toggle', annotations: {} }] } },
    ]
    const { markdownContent, images } = await convertBlocksToMarkdown(mockClient, blocks);

    expect(markdownContent).toContain('Hello')
    expect(markdownContent).toContain('# Title')
    expect(markdownContent).toContain('## Subtitle')
    expect(markdownContent).toContain('### Section')
    expect(markdownContent).toContain('- Item 1\n')
    expect(markdownContent).toContain('1. Item 2\n')
    expect(markdownContent).toContain('```javascript\nconsole.log("Hello")\n```')
    expect(markdownContent).toContain('![An image](http://example.com/image.png)')
    expect(markdownContent).toContain('> Note')
    expect(markdownContent).toContain('> Famous quote')
    expect(markdownContent).toContain('---')
    expect(markdownContent).toContain('Toggle')
    expect(images).toEqual([{ url: 'http://example.com/image.png', alt: 'An image' }])
  })

  it('should convert image blocks with alt text to markdown', async () => {
    const blocks = [
      {
        type: 'image',
        image: {
          file: { url: 'http://example.com/image.png' },
          caption: [{ plain_text: 'Une image avec un texte alternatif' }],
        },
      },
    ]
    const { markdownContent, images } = await convertBlocksToMarkdown(mockClient, blocks);

    expect(markdownContent).toContain('![Une image avec un texte alternatif](http://example.com/image.png)')
    expect(images).toEqual([{ url: 'http://example.com/image.png', alt: 'Une image avec un texte alternatif' }])
  })

  it('should throw an error for images without alt text', async () => {
    const blocks = [
      {
        type: 'image',
        image: {
          file: { url: 'http://example.com/image-without-alt.png' },
          caption: [],
        },
      },
    ]

    await expect(async() => await convertBlocksToMarkdown(mockClient, blocks))
      .rejects.toThrow('Image without alt text detected: http://example.com/image-without-alt.png')
  })

  it('should handle empty blocks gracefully', async () => {
    const blocks = [
      { type: 'paragraph', paragraph: { rich_text: [{ plain_text: '', annotations: {} }] } },
      { type: 'heading_1', heading_1: { rich_text: [{ plain_text: '', annotations: {} }] } },
    ]
    const { markdownContent, images } = await convertBlocksToMarkdown(mockClient, blocks);

    expect(markdownContent).toBe('\n\n## ')
    expect(images).toEqual([])
  })

  it('should convert paragraphs with links to markdown', async () => {
    const blocks = [
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [
            { plain_text: 'Ceci est un ', href: null, annotations: {} },
            { plain_text: 'lien', href: 'https://example.com', annotations: {} },
            { plain_text: ' dans un paragraphe.', href: null, annotations: {} },
          ],
        },
      },
    ]
    const { markdownContent } = await convertBlocksToMarkdown(mockClient, blocks);

    expect(markdownContent).toBe('Ceci est un [lien](https://example.com) dans un paragraphe.')
  })

})
