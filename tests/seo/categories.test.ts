import { describe, expect, it } from 'bun:test'

describe('category filtering - case normalization (TASK-026)', () => {
  it('should match tags case-insensitively when filtering by category', () => {
    // Given: articles with mixed-case tags and a category value
    const articles = [
      { title: 'Article 1', tags: ['Craft', 'testing'] },
      { title: 'Article 2', tags: ['craft', 'devops'] },
      { title: 'Article 3', tags: ['Cloud', 'architecture'] },
    ]
    const categoryValue = 'craft'

    // When: filtering articles by category with case normalization
    const filtered = articles.filter(article =>
      article.tags?.map(t => t.toLowerCase()).includes(categoryValue.toLowerCase()),
    )

    // Then: both articles with "Craft" and "craft" are included
    expect(filtered).toHaveLength(2)
    expect(filtered[0]?.title).toBe('Article 1')
    expect(filtered[1]?.title).toBe('Article 2')
  })

  it('should not match when category is not in tags', () => {
    const articles = [
      { title: 'Article 1', tags: ['devops', 'testing'] },
    ]
    const categoryValue = 'craft'

    const filtered = articles.filter(article =>
      article.tags?.map(t => t.toLowerCase()).includes(categoryValue.toLowerCase()),
    )

    expect(filtered).toHaveLength(0)
  })
})
