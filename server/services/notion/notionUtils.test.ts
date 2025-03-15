import { describe, expect, it } from 'vitest'
import { safeGetProperty } from './notionUtils'
import { convertBlocksToMarkdown } from './blockConverter'
import { Client } from '@notionhq/client'

const mockClient = new Client({ auth: 'test-token' })

describe('notionUtils', () => {
  it('should safely get a property from an object', () => {
    const obj = { a: { b: { c: 42 } } }
    expect(safeGetProperty(obj, ['a', 'b', 'c'])).toBe(42)
    expect(safeGetProperty(obj, ['a', 'b', 'd'], 'default')).toBe('default')
  })

  it('should convert blocks to markdown', async () => {
    const blocks = [
      { type: 'paragraph', paragraph: { rich_text: [{ plain_text: 'Hello', annotations: {} }] } },
      { type: 'heading_1', heading_1: { rich_text: [{ plain_text: 'Title', annotations: {} }] } },
      { type: 'image', image: { file: { url: 'http://example.com/image.png' }, caption: [{ plain_text: 'An image' }] } },
    ]
    const { markdownContent, images } = await convertBlocksToMarkdown(mockClient, blocks)

    expect(markdownContent).toContain('Hello\n\n')
    expect(markdownContent).toContain('# Title\n\n')
    expect(images).toEqual([{ url: 'http://example.com/image.png', alt: 'An image' }])
  })
})
