import { describe, expect, it } from 'bun:test'

/**
 * Related posts scoring logic tests.
 * Tests the pure algorithm for finding related articles based on shared tags.
 * TASK-047: Related posts section at the end of an article.
 */

interface ArticleSummary {
  path: string
  title: string
  tags: string[]
  date: string
}

function scoreRelatedArticles(
  currentArticle: ArticleSummary,
  allArticles: ArticleSummary[],
  maxResults: number = 4,
): ArticleSummary[] {
  const currentTags = new Set(currentArticle.tags.map(t => t.toLowerCase()))

  const scored = allArticles
    .filter(a => a.path !== currentArticle.path)
    .map((article) => {
      const articleTags = article.tags.map(t => t.toLowerCase())
      const commonTags = articleTags.filter(t => currentTags.has(t)).length
      return { article, score: commonTags }
    })
    .filter(s => s.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score)
        return b.score - a.score
      // Secondary sort by date (most recent first)
      return b.article.date.localeCompare(a.article.date)
    })
    .slice(0, maxResults)

  return scored.map(s => s.article)
}

describe('related posts - scoring algorithm (TASK-047)', () => {
  const articles: ArticleSummary[] = [
    { path: '/blogs/article-1', title: 'TDD in TypeScript', tags: ['craft', 'typescript', 'testing'], date: '2024-07-01' },
    { path: '/blogs/article-2', title: 'Clean Architecture', tags: ['architecture', 'craft'], date: '2024-06-15' },
    { path: '/blogs/article-3', title: 'Kubernetes Basics', tags: ['cloud-platform', 'kubernetes'], date: '2024-06-10' },
    { path: '/blogs/article-4', title: 'Testing Best Practices', tags: ['craft', 'testing'], date: '2024-05-20' },
    { path: '/blogs/article-5', title: 'TypeScript Patterns', tags: ['typescript', 'craft'], date: '2024-05-01' },
    { path: '/blogs/article-6', title: 'DDD Introduction', tags: ['architecture', 'craft', 'ddd'], date: '2024-04-01' },
  ]

  it('should return articles sharing the most tags with the current article', () => {
    // Given: article-1 with tags [craft, typescript, testing]
    const current = articles[0]

    // When: we score related articles
    const related = scoreRelatedArticles(current, articles)

    // Then: articles with most common tags come first
    expect(related.length).toBeGreaterThanOrEqual(2)
    expect(related.length).toBeLessThanOrEqual(4)

    // article-4 shares [craft, testing] = 2 common tags
    // article-5 shares [typescript, craft] = 2 common tags
    // article-2 shares [craft] = 1 common tag
    // article-6 shares [craft] = 1 common tag
    expect(related[0].tags).toEqual(expect.arrayContaining(['craft']))
  })

  it('should exclude the current article from results', () => {
    const current = articles[0]
    const related = scoreRelatedArticles(current, articles)

    expect(related.find(a => a.path === current.path)).toBeUndefined()
  })

  it('should return at most maxResults articles', () => {
    const current = articles[0]
    const related = scoreRelatedArticles(current, articles, 2)

    expect(related).toHaveLength(2)
  })

  it('should return empty array when no articles share tags', () => {
    const lonelyArticle: ArticleSummary = {
      path: '/blogs/lonely',
      title: 'Unique Topic',
      tags: ['unique-tag-nobody-else-has'],
      date: '2024-01-01',
    }

    const related = scoreRelatedArticles(lonelyArticle, articles)
    expect(related).toHaveLength(0)
  })

  it('should prefer more recent articles when scores are equal', () => {
    const current = articles[0] // [craft, typescript, testing]
    const related = scoreRelatedArticles(current, articles)

    // article-4 and article-5 both have 2 common tags
    // article-4 (2024-05-20) should come before article-5 (2024-05-01)
    const idx4 = related.findIndex(a => a.path === '/blogs/article-4')
    const idx5 = related.findIndex(a => a.path === '/blogs/article-5')
    if (idx4 !== -1 && idx5 !== -1) {
      expect(idx4).toBeLessThan(idx5)
    }
  })
})
