import { describe, expect, it } from 'bun:test'

/**
 * Sitemap logic tests.
 * Tests the pure logic for generating sitemap URL entries with lastmod dates.
 * TASK-035: Each sitemap URL must have a lastmod in ISO format.
 */

interface SitemapUrl {
  loc: string
  lastmod?: string
}

function buildArticleSitemapEntries(
  articles: Array<{ path: string, date: string }>,
  baseUrl: string,
): SitemapUrl[] {
  return articles.map(article => ({
    loc: `${baseUrl}${article.path}`,
    lastmod: article.date,
  }))
}

function buildCategorySitemapEntries(
  categories: Array<{ value: string }>,
  articlesByCategory: Record<string, Array<{ date: string }>>,
  baseUrl: string,
): SitemapUrl[] {
  return categories.map((cat) => {
    const articles = articlesByCategory[cat.value] || []
    const latestDate = articles.length > 0
      ? articles.sort((a, b) => b.date.localeCompare(a.date))[0]?.date ?? ''
      : new Date().toISOString().split('T')[0]
    return {
      loc: `${baseUrl}/categories/${cat.value}`,
      lastmod: latestDate,
    }
  })
}

function buildTagSitemapEntries(
  tagCounts: Record<string, { count: number, latestDate: string }>,
  baseUrl: string,
  minArticles: number = 3,
): SitemapUrl[] {
  return Object.entries(tagCounts)
    .filter(([_, info]) => info.count >= minArticles)
    .map(([tag, info]) => ({
      loc: `${baseUrl}/tags/${tag}`,
      lastmod: info.latestDate,
    }))
}

describe('sitemap - article entries with lastmod (TASK-035)', () => {
  it('should generate sitemap entries with lastmod for each article', () => {
    // Given: articles with dates
    const articles = [
      { path: '/blogs/article-1', date: '2024-06-10' },
      { path: '/blogs/article-2', date: '2024-07-15' },
    ]
    const baseUrl = 'https://blog.hoppr.tech'

    // When: we build sitemap entries
    const entries = buildArticleSitemapEntries(articles, baseUrl)

    // Then: each entry has a lastmod in ISO date format
    for (const entry of entries) {
      expect(entry.lastmod).toBeDefined()
      expect(entry.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}/)
    }
    expect(entries[0]?.loc).toBe('https://blog.hoppr.tech/blogs/article-1')
    expect(entries[0]?.lastmod).toBe('2024-06-10')
  })
})

describe('sitemap - category entries (TASK-040)', () => {
  it('should include all 4 categories in the sitemap', () => {
    const categories = [
      { value: 'craft' },
      { value: 'cloud-platform' },
      { value: 'architecture' },
      { value: 'others' },
    ]
    const articlesByCategory: Record<string, Array<{ date: string }>> = {
      'craft': [{ date: '2024-06-10' }, { date: '2024-07-01' }],
      'cloud-platform': [{ date: '2024-05-01' }],
      'architecture': [{ date: '2024-08-01' }],
      'others': [{ date: '2024-04-01' }],
    }

    const entries = buildCategorySitemapEntries(categories, articlesByCategory, 'https://blog.hoppr.tech')

    expect(entries).toHaveLength(4)
    expect(entries[0]?.loc).toBe('https://blog.hoppr.tech/categories/craft')
    // lastmod should be the latest article date in that category
    expect(entries[0]?.lastmod).toBe('2024-07-01')
  })
})

describe('sitemap - tag entries filtered by article count (TASK-039)', () => {
  it('should only include tags with >= 3 articles in the sitemap', () => {
    const tagCounts: Record<string, { count: number, latestDate: string }> = {
      'typescript': { count: 5, latestDate: '2024-07-01' },
      'testing': { count: 3, latestDate: '2024-06-15' },
      'rare-tag': { count: 1, latestDate: '2024-01-01' },
      'niche': { count: 2, latestDate: '2024-03-01' },
    }

    const entries = buildTagSitemapEntries(tagCounts, 'https://blog.hoppr.tech')

    // Only typescript (5) and testing (3) qualify
    expect(entries).toHaveLength(2)
    expect(entries.map(e => e.loc)).toContain('https://blog.hoppr.tech/tags/typescript')
    expect(entries.map(e => e.loc)).toContain('https://blog.hoppr.tech/tags/testing')
    expect(entries.map(e => e.loc)).not.toContain('https://blog.hoppr.tech/tags/rare-tag')
  })
})
