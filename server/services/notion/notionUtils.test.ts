import { describe, expect, it } from 'vitest'
import { safeGetProperty } from './notionUtils'
import { convertBlocksToMarkdown } from './blockConverter'

describe('notionUtils', () => {
  it('should safely get a property from an object', () => {
    const obj = { a: { b: { c: 42 } } }
    expect(safeGetProperty(obj, ['a', 'b', 'c'])).toBe(42)
    expect(safeGetProperty(obj, ['a', 'b', 'd'], 'default')).toBe('default')
  })

  it('should convert blocks to markdown', () => {
    const blocks = [
      { type: 'paragraph', paragraph: { rich_text: [{ plain_text: 'Hello' }] } },
      { type: 'heading_1', heading_1: { rich_text: [{ plain_text: 'Title' }] } },
      { type: 'image', image: { file: { url: 'http://example.com/image.png' }, caption: [{ plain_text: 'An image' }] } },
    ]
    const { markdownContent, images } = convertBlocksToMarkdown(blocks)

    expect(markdownContent).toContain('Hello\n\n')
    expect(markdownContent).toContain('# Title\n\n')
    expect(images).toEqual([{ url: 'http://example.com/image.png', alt: 'An image' }])
  })
})
