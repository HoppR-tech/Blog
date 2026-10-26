import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { Client } from '@notionhq/client'
import { describe, expect, it, vi } from 'vitest'
import { convertBlocksToMarkdown, MissingImageAltError } from './blockConverter'

const mockClient = new Client({ auth: 'test-token' })

describe('blockConverter', () => {
  it('preserves interview paragraphs, formatting and dividers inside an empty quote', async () => {
    const list = vi.fn().mockResolvedValue({
      results: [
        paragraph('Paroles d’équipe', { bold: true }),
        paragraph('Premier témoignage'),
        buildBlock({ type: 'divider' }),
        paragraph('Second témoignage'),
      ],
      has_more: false,
      next_cursor: null,
    })
    const { markdownContent } = await convertBlocksToMarkdown(clientWithChildren(list), [quote('interview')])

    expect(markdownContent).toBe('> **Paroles d’équipe**\n>\n> Premier témoignage\n>\n> ---\n>\n> Second témoignage')
    expect(list).toHaveBeenCalledWith(expect.objectContaining({ block_id: 'interview' }))
  })

  it('preserves parent text, paginated children and nested quotes in order without duplicates', async () => {
    const list = vi.fn().mockImplementation(async ({ block_id, start_cursor }) => {
      if (block_id === 'nested')
        return { results: [paragraph('Réponse imbriquée')], has_more: false, next_cursor: null }
      if (start_cursor === 'page-2')
        return { results: [quote('nested'), paragraph('Conclusion')], has_more: false, next_cursor: null }
      return { results: [paragraph('Introduction')], has_more: true, next_cursor: 'page-2' }
    })
    const { markdownContent } = await convertBlocksToMarkdown(clientWithChildren(list), [quote('interview', 'Titre')])

    expect(markdownContent).toBe('> Titre\n>\n> Introduction\n>\n> > Réponse imbriquée\n>\n> Conclusion')
    expect(list).toHaveBeenCalledWith(expect.objectContaining({ block_id: 'interview', start_cursor: 'page-2' }))
    expect(list).toHaveBeenCalledTimes(3)
  })

  it('collects images inside quotes and retains their alt validation', async () => {
    const image = buildBlock({ type: 'image', image: { type: 'external', external: { url: 'https://example.com/setup.png' }, caption: [{ plain_text: 'Poste de travail' }] } })
    const list = vi.fn().mockResolvedValue({ results: [image], has_more: false, next_cursor: null })
    const { markdownContent, images } = await convertBlocksToMarkdown(clientWithChildren(list), [quote('interview')])

    expect(markdownContent).toBe('> ![Poste de travail](https://example.com/setup.png)')
    expect(images).toEqual([{ url: 'https://example.com/setup.png', alt: 'Poste de travail' }])

    list.mockResolvedValue({ results: [buildBlock({ ...image, image: { ...('image' in image && image.image), caption: [] } })], has_more: false, next_cursor: null })
    await expect(convertBlocksToMarkdown(clientWithChildren(list), [quote('interview')])).rejects.toThrow(MissingImageAltError)
  })

  it('fails conversion when fetching quote children fails instead of publishing an incomplete article', async () => {
    const list = vi.fn().mockRejectedValue(new Error('Notion unavailable'))
    await expect(convertBlocksToMarkdown(clientWithChildren(list), [quote('interview')])).rejects.toThrow('Notion unavailable')
  })

  it('should convert various block types to markdown', async () => {
    const blocks = [
      buildBlock({ type: 'paragraph', paragraph: { rich_text: [{ plain_text: 'Hello', annotations: {} }] } }),
      buildBlock({ type: 'heading_1', heading_1: { rich_text: [{ plain_text: 'Title', annotations: {} }] } }),
      buildBlock({ type: 'heading_2', heading_2: { rich_text: [{ plain_text: 'Subtitle', annotations: {} }] } }),
      buildBlock({ type: 'heading_3', heading_3: { rich_text: [{ plain_text: 'Section', annotations: {} }] } }),
      buildBlock({ type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ plain_text: 'Item 1', annotations: {} }] } }),
      buildBlock({ type: 'numbered_list_item', numbered_list_item: { rich_text: [{ plain_text: 'Item 2', annotations: {} }], number: 1 } }),
      buildBlock({ type: 'code', code: { language: 'javascript', rich_text: [{ plain_text: 'console.log("Hello")', annotations: {} }] } }),
      buildBlock({ type: 'image', image: { file: { url: 'http://example.com/image.png' }, caption: [{ plain_text: 'An image' }], type: 'file' } }),
      buildBlock({ type: 'callout', callout: { rich_text: [{ plain_text: 'Note', annotations: {} }] } }),
      buildBlock({ type: 'quote', quote: { rich_text: [{ plain_text: 'Famous quote', annotations: {} }] } }),
      buildBlock({ type: 'divider' }),
      buildBlock({ type: 'table_of_contents', table_of_contents: { color: 'default' } }),
      buildBlock({ type: 'toggle', toggle: { rich_text: [{ plain_text: 'Toggle', annotations: {} }] } }),
    ]
    const { markdownContent, images } = await convertBlocksToMarkdown(mockClient, blocks)

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
      buildBlock({
        type: 'image',
        image: {
          file: { url: 'http://example.com/image.png' },
          caption: [{ plain_text: 'Une image avec un texte alternatif' }],
          type: 'file',
        },
      }),
    ]
    const { markdownContent, images } = await convertBlocksToMarkdown(mockClient, blocks)

    expect(markdownContent).toContain('![Une image avec un texte alternatif](http://example.com/image.png)')
    expect(images).toEqual([{ url: 'http://example.com/image.png', alt: 'Une image avec un texte alternatif' }])
  })

  it('should throw a clear error for an image without alt text (so the article is not published)', async () => {
    const blocks = [
      buildBlock({
        id: 'block-no-caption',
        type: 'image',
        image: {
          file: { url: 'http://example.com/no-caption.png' },
          caption: [],
          type: 'file',
        },
      }),
    ]

    await expect(convertBlocksToMarkdown(mockClient, blocks)).rejects.toThrow(MissingImageAltError)
    await expect(convertBlocksToMarkdown(mockClient, blocks)).rejects.toThrow(/sans texte alternatif.*block-no-caption/s)
  })

  it('should treat a whitespace-only caption as missing alt text', async () => {
    const blocks = [
      buildBlock({
        id: 'block-blank-caption',
        type: 'image',
        image: {
          file: { url: 'http://example.com/blank.png' },
          caption: [{ plain_text: '   ' }],
          type: 'file',
        },
      }),
    ]

    await expect(convertBlocksToMarkdown(mockClient, blocks)).rejects.toThrow(MissingImageAltError)
  })

  it('should handle empty blocks gracefully', async () => {
    const blocks = [
      buildBlock({ type: 'paragraph', paragraph: { rich_text: [{ plain_text: '', annotations: {} }] } }),
      buildBlock({ type: 'heading_1', heading_1: { rich_text: [{ plain_text: '', annotations: {} }] } }),
    ]
    const { markdownContent, images } = await convertBlocksToMarkdown(mockClient, blocks)

    expect(markdownContent).toBe('\n\n# ')
    expect(images).toEqual([])
  })

  it('should convert paragraphs with links to markdown', async () => {
    const blocks = [
      buildBlock({
        type: 'paragraph',
        paragraph: {
          rich_text: [
            { plain_text: 'Ceci est un ', href: null, annotations: {} },
            { plain_text: 'lien', href: 'https://example.com', annotations: {} },
            { plain_text: ' dans un paragraphe.', href: null, annotations: {} },
          ],
        },
      }),
    ]
    const { markdownContent } = await convertBlocksToMarkdown(mockClient, blocks)

    expect(markdownContent).toBe('Ceci est un [lien](https://example.com) dans un paragraphe.')
  })

  it('should convert equation blocks to markdown', async () => {
    const blocks = [
      buildBlock({
        type: 'equation',
        equation: {
          expression: 'E = mc^2',
        },
      }),
    ]
    const { markdownContent } = await convertBlocksToMarkdown(mockClient, blocks)

    expect(markdownContent).toContain('$$\nE = mc^2\n$$')
  })

  it('should convert inline equations to markdown', async () => {
    const blocks = [
      buildBlock({
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            type: 'equation',
            equation: {
              expression: 'E = mc^2',
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: '$E = mc^2$',
            href: null,
          }],
        },
      }),
    ]
    const { markdownContent } = await convertBlocksToMarkdown(mockClient, blocks)

    expect(markdownContent).toContain('$E = mc^2$')
  })

  it('should convert table blocks to markdown with proper formatting', async () => {
    const blocks = [
      buildBlock({
        type: 'table',
        table: {
          has_column_header: true,
          has_row_header: false,
          children: [
            { cells: [['Header 1'], ['Header 2']] },
            { cells: [['Cell 1'], ['• Item 1\n• Item 2']] },
            { cells: [['info/product_id'], ['release.mgmt/deploy.src']] },
          ],
        },
      }),
    ]
    const { markdownContent } = await convertBlocksToMarkdown(mockClient, blocks)

    expect(markdownContent).toContain('| Header 1 | Header 2 |')
    expect(markdownContent).toContain('| --- | --- |')
    expect(markdownContent).toContain('| Cell 1 | <ul><li>Item 1</li><li>Item 2</li></ul> |')
    expect(markdownContent).toContain('| `info/product_id` | `release.mgmt/deploy.src` |')
  })
})

function buildBlock(block: any): BlockObjectResponse {
  return {
    ...block,
    id: block.id ?? block.type,
  }
}

function paragraph(text: string, annotations = {}) {
  return buildBlock({ type: 'paragraph', paragraph: { rich_text: [{ plain_text: text, annotations }] } })
}

function quote(id: string, text = '') {
  return buildBlock({ id, type: 'quote', has_children: true, quote: { rich_text: text ? [{ plain_text: text, annotations: {} }] : [] } })
}

function clientWithChildren(list: ReturnType<typeof vi.fn>): Client {
  return { blocks: { children: { list } } } as unknown as Client
}
