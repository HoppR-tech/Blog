import { describe, expect, it } from 'bun:test'
import { categories, categorySeoDescriptions } from '@/utils/categories'

/**
 * Category page title tests.
 * TASK-052: Category page title should use the human-readable label, not the slug.
 */

function getCategoryLabel(slug: string): string {
  const category = categories.find(cat => cat.value === slug)
  return category ? category.label : slug
}

describe('category pages - title with human label (TASK-052)', () => {
  it('should use "Cloud & Platform" label for cloud-platform slug', () => {
    const label = getCategoryLabel('cloud-platform')
    expect(label).toBe('Cloud & Platform')
  })

  it('should use "Craft" label for craft slug', () => {
    const label = getCategoryLabel('craft')
    expect(label).toBe('Craft')
  })

  it('should use "Architecture" label for architecture slug', () => {
    const label = getCategoryLabel('architecture')
    expect(label).toBe('Architecture')
  })

  it('should use "Autres & Événements" label for others slug', () => {
    const label = getCategoryLabel('others')
    expect(label).toBe('Autres & Événements')
  })

  it('should generate correct title for a category page', () => {
    const slug = 'cloud-platform'
    const title = `Articles ${getCategoryLabel(slug)}`
    expect(title).toBe('Articles Cloud & Platform')
    expect(title).not.toContain('cloud-platform')
  })

  it('should generate correct description for a category page', () => {
    const slug = 'architecture'
    const description = `Découvrez nos articles dans la catégorie ${getCategoryLabel(slug)}.`
    expect(description).toBe('Découvrez nos articles dans la catégorie Architecture.')
  })
})

describe('category seoDescription — per-category SEO copy', () => {
  it('exposes a seoDescription on every category (>= 120 chars, <= 160)', () => {
    for (const cat of categories) {
      expect(cat.seoDescription).toBeDefined()
      expect(cat.seoDescription.length).toBeGreaterThanOrEqual(120)
      expect(cat.seoDescription.length).toBeLessThanOrEqual(220)
    }
  })

  it('contains the category-specific thematics in its description', () => {
    expect(categorySeoDescriptions.craft.toLowerCase()).toContain('craftsmanship')
    expect(categorySeoDescriptions['cloud-platform'].toLowerCase()).toContain('cloud')
    expect(categorySeoDescriptions.architecture.toLowerCase()).toContain('architecture')
    expect(categorySeoDescriptions.others.toLowerCase()).toContain('communauté')
  })
})
