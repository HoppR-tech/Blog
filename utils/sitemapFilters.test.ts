import { describe, expect, it } from 'bun:test'
import { isSitemapArticle } from './sitemapFilters'

describe('isSitemapArticle', () => {
  it('keeps published articles with a /blogs/ slug', () => {
    expect(isSitemapArticle({ path: '/blogs/2026-06-22-effect', published: true })).toBe(true)
  })

  it('drops unpublished drafts even with a valid path', () => {
    expect(isSitemapArticle({ path: '/blogs/2026-06-22-effect', published: false })).toBe(false)
  })

  it('drops articles with no published flag (defaults to draft)', () => {
    expect(isSitemapArticle({ path: '/blogs/2026-06-22-effect' })).toBe(false)
  })

  it('drops malformed entries whose path is a raw Notion id (renders the 404 page)', () => {
    expect(isSitemapArticle({ path: '/1acf4462cd38809f802ecb90c6901fba', published: true })).toBe(false)
  })

  it('drops entries with a missing path', () => {
    expect(isSitemapArticle({ published: true })).toBe(false)
  })
})
