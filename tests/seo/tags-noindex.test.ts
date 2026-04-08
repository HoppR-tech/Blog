import { describe, expect, it } from 'bun:test'

/**
 * Tags noindex logic tests.
 * Tests the pure logic for determining whether a tag page should be noindexed
 * based on the number of articles associated with the tag.
 * TASK-037: Tags with < 3 articles should have noindex.
 * TASK-039: Tags with >= 3 articles should be indexable.
 */

const MIN_ARTICLES_FOR_INDEX = 3

function shouldNoindexTag(articleCount: number): boolean {
  return articleCount < MIN_ARTICLES_FOR_INDEX
}

describe('tags noindex - thin content tags (TASK-037)', () => {
  it('should noindex a tag with 1 article', () => {
    expect(shouldNoindexTag(1)).toBe(true)
  })

  it('should noindex a tag with 2 articles', () => {
    expect(shouldNoindexTag(2)).toBe(true)
  })

  it('should noindex a tag with 0 articles', () => {
    expect(shouldNoindexTag(0)).toBe(true)
  })
})

describe('tags noindex - sufficient content tags (TASK-039)', () => {
  it('should NOT noindex a tag with exactly 3 articles', () => {
    expect(shouldNoindexTag(3)).toBe(false)
  })

  it('should NOT noindex a tag with 5 articles', () => {
    expect(shouldNoindexTag(5)).toBe(false)
  })

  it('should NOT noindex a tag with 10 articles', () => {
    expect(shouldNoindexTag(10)).toBe(false)
  })
})
