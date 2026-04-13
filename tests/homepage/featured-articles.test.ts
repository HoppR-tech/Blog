import { describe, expect, it } from 'bun:test'
import { selectFeaturedArticles } from '../../src/domain/select-featured-articles'

interface Post {
  path: string
  title: string
  date: string
  tags: string[]
}

function makePost(overrides: Partial<Post> & { path: string }): Post {
  return {
    title: overrides.path,
    date: '2026-01-01',
    tags: [],
    ...overrides,
  }
}

const CATEGORIES = ['craft', 'cloud-platform', 'architecture', 'others']

describe('Articles a la Une - selection par categorie', () => {
  // TASK-001: Un article recent par categorie
  describe('Scenario: Un article recent par categorie', () => {
    it('should return 4 articles, one per category', () => {
      // Given: articles in all 4 categories
      const allPosts: Post[] = [
        makePost({ path: '/recent-1', date: '2026-04-08', tags: ['craft'] }),
        makePost({ path: '/recent-2', date: '2026-04-07', tags: ['cloud-platform'] }),
        makePost({ path: '/recent-3', date: '2026-04-06', tags: ['architecture'] }),
        makePost({ path: '/craft-1', date: '2026-03-15', tags: ['craft'] }),
        makePost({ path: '/cloud-1', date: '2026-03-10', tags: ['cloud-platform'] }),
        makePost({ path: '/archi-1', date: '2026-02-20', tags: ['architecture'] }),
        makePost({ path: '/others-1', date: '2026-02-10', tags: ['others'] }),
      ]

      // When: selecting featured articles
      const result = selectFeaturedArticles(allPosts, CATEGORIES)

      // Then: 4 articles returned, each from a different category
      expect(result).toHaveLength(4)
      const resultCategories = result.map((post) => {
        return CATEGORIES.find(cat => post.tags.map(t => t.toLowerCase()).includes(cat))
      })
      expect(new Set(resultCategories).size).toBe(4)
    })
  })

  // TASK-002: Pas de doublon avec les Derniers Articles
  describe('Scenario: Pas de doublon avec les Derniers Articles', () => {
    it('should exclude the 3 most recent articles and pick the next one per category', () => {
      // Given: the 3 most recent articles are already displayed in "Derniers Articles"
      const allPosts: Post[] = [
        makePost({ path: '/recent-1', date: '2026-04-08', tags: ['craft'] }), // recent (excluded)
        makePost({ path: '/recent-2', date: '2026-04-07', tags: ['cloud-platform'] }), // recent (excluded)
        makePost({ path: '/recent-3', date: '2026-04-06', tags: ['architecture'] }), // recent (excluded)
        makePost({ path: '/craft-2', date: '2026-03-15', tags: ['craft'] }),
        makePost({ path: '/cloud-2', date: '2026-03-10', tags: ['cloud-platform'] }),
        makePost({ path: '/archi-2', date: '2026-02-20', tags: ['architecture'] }),
        makePost({ path: '/others-1', date: '2026-02-10', tags: ['others'] }),
      ]

      // When: selecting featured articles
      const result = selectFeaturedArticles(allPosts, CATEGORIES)

      // Then: none of the 4 selected articles is in the 3 most recent
      const recentPaths = ['/recent-1', '/recent-2', '/recent-3']
      result.forEach((post) => {
        expect(recentPaths).not.toContain(post.path)
      })

      // And: it's the 2nd most recent of each category that is picked
      expect(result.find(p => p.tags.includes('craft'))?.path).toBe('/craft-2')
      expect(result.find(p => p.tags.includes('cloud-platform'))?.path).toBe('/cloud-2')
      expect(result.find(p => p.tags.includes('architecture'))?.path).toBe('/archi-2')
    })
  })

  // TASK-003: Fallback si tous les articles d'une categorie sont dans les 3 derniers
  describe('Scenario: Categorie sans article disponible (hors doublons)', () => {
    it('should fallback to include the article even if it is in the 3 most recent', () => {
      // Given: a category whose only article is in the 3 most recent
      const allPosts: Post[] = [
        makePost({ path: '/recent-1', date: '2026-04-08', tags: ['craft'] }), // recent — only craft article
        makePost({ path: '/recent-2', date: '2026-04-07', tags: ['cloud-platform'] }),
        makePost({ path: '/recent-3', date: '2026-04-06', tags: ['architecture'] }),
        makePost({ path: '/cloud-2', date: '2026-03-10', tags: ['cloud-platform'] }),
        makePost({ path: '/archi-2', date: '2026-02-20', tags: ['architecture'] }),
        makePost({ path: '/others-1', date: '2026-02-10', tags: ['others'] }),
      ]

      // When: selecting featured articles
      const result = selectFeaturedArticles(allPosts, CATEGORIES)

      // Then: the craft article is still included (fallback, even if duplicate)
      expect(result).toHaveLength(4)
      expect(result.find(p => p.tags.includes('craft'))?.path).toBe('/recent-1')
    })
  })

  // Article with multiple categories should not appear twice
  describe('Scenario: Pas de doublon quand un article a plusieurs catégories', () => {
    it('should never select the same article twice even if it matches multiple categories', () => {
      const allPosts: Post[] = [
        makePost({ path: '/recent-1', date: '2026-04-08', tags: ['craft'] }),
        makePost({ path: '/recent-2', date: '2026-04-07', tags: ['cloud-platform'] }),
        makePost({ path: '/recent-3', date: '2026-04-06', tags: ['architecture'] }),
        // This article matches BOTH craft and cloud-platform
        makePost({ path: '/multi-cat', date: '2026-02-03', tags: ['craft', 'cloud-platform'] }),
        makePost({ path: '/craft-only', date: '2026-01-15', tags: ['craft'] }),
        makePost({ path: '/cloud-only', date: '2026-01-10', tags: ['cloud-platform'] }),
        makePost({ path: '/archi-1', date: '2026-01-05', tags: ['architecture'] }),
        makePost({ path: '/others-1', date: '2025-12-01', tags: ['others'] }),
      ]

      const result = selectFeaturedArticles(allPosts, CATEGORIES)

      // No duplicate paths
      const paths = result.map(p => p.path)
      expect(new Set(paths).size).toBe(paths.length)

      // 4 unique articles
      expect(result).toHaveLength(4)
    })
  })

  // TASK-004: Ordre d'affichage par date DESC
  describe('Scenario: Ordre d\'affichage par date', () => {
    it('should return the 4 articles sorted by date descending', () => {
      // Given: 4 articles from different categories with varied dates
      const allPosts: Post[] = [
        makePost({ path: '/recent-1', date: '2026-04-08', tags: ['others'] }),
        makePost({ path: '/recent-2', date: '2026-04-07', tags: ['craft'] }),
        makePost({ path: '/recent-3', date: '2026-04-06', tags: ['cloud-platform'] }),
        makePost({ path: '/craft-1', date: '2026-03-01', tags: ['craft'] }),
        makePost({ path: '/cloud-1', date: '2026-01-15', tags: ['cloud-platform'] }),
        makePost({ path: '/archi-1', date: '2026-02-20', tags: ['architecture'] }),
        makePost({ path: '/others-2', date: '2025-12-01', tags: ['others'] }),
      ]

      // When: selecting featured articles
      const result = selectFeaturedArticles(allPosts, CATEGORIES)

      // Then: sorted by date descending
      for (let i = 0; i < result.length - 1; i++) {
        const current = result[i]
        const next = result[i + 1]
        if (current && next) {
          expect(current.date >= next.date).toBe(true)
        }
      }
    })
  })

  // TASK-005: Pas de fenetre temporelle limitante
  describe('Scenario: Pas de fenetre temporelle limitante', () => {
    it('should select an article even if it is 6 months old', () => {
      // Given: a category whose latest article is 6 months old
      const allPosts: Post[] = [
        makePost({ path: '/recent-1', date: '2026-04-08', tags: ['craft'] }),
        makePost({ path: '/recent-2', date: '2026-04-07', tags: ['cloud-platform'] }),
        makePost({ path: '/recent-3', date: '2026-04-06', tags: ['architecture'] }),
        makePost({ path: '/craft-2', date: '2026-03-15', tags: ['craft'] }),
        makePost({ path: '/cloud-2', date: '2026-03-10', tags: ['cloud-platform'] }),
        makePost({ path: '/archi-2', date: '2026-02-20', tags: ['architecture'] }),
        makePost({ path: '/others-old', date: '2025-10-01', tags: ['others'] }), // 6 months old
      ]

      // When: selecting featured articles
      const result = selectFeaturedArticles(allPosts, CATEGORIES)

      // Then: the old article is still selected for its category
      expect(result.find(p => p.tags.includes('others'))?.path).toBe('/others-old')
    })
  })
})
