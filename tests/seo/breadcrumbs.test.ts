import { describe, expect, it } from 'bun:test'
import { categories } from '@/utils/categories'

/**
 * Breadcrumb logic tests.
 * Tests the pure logic of determining the primary category from tags
 * and generating breadcrumb items.
 */

function findPrimaryCategory(tags: string[]): { label: string, value: string } | null {
  if (!tags || tags.length === 0)
    return null

  for (const tag of tags) {
    const cat = categories.find(c => c.value.toLowerCase() === tag.toLowerCase())
    if (cat)
      return { label: cat.label, value: cat.value }
  }

  return null
}

function generateBreadcrumbItems(
  articleTitle: string,
  articlePath: string,
  tags: string[],
  baseUrl: string,
): Array<{ name: string, url: string }> {
  const items: Array<{ name: string, url: string }> = [
    { name: 'Accueil', url: baseUrl },
  ]

  const primaryCategory = findPrimaryCategory(tags)
  if (primaryCategory) {
    items.push({
      name: primaryCategory.label,
      url: `${baseUrl}/categories/${primaryCategory.value}`,
    })
  }

  items.push({
    name: articleTitle,
    url: `${baseUrl}${articlePath}`,
  })

  return items
}

describe('breadcrumbs - category detection (TASK-030)', () => {
  it('should detect "craft" as a primary category', () => {
    const cat = findPrimaryCategory(['craft', 'testing', 'typescript'])
    expect(cat).toBeDefined()
    expect(cat!.label).toBe('Craft')
    expect(cat!.value).toBe('craft')
  })

  it('should detect "architecture" as a primary category', () => {
    const cat = findPrimaryCategory(['hexagonal', 'architecture', 'ddd'])
    expect(cat).toBeDefined()
    expect(cat!.label).toBe('Architecture')
  })

  it('should detect "cloud-platform" as a primary category', () => {
    const cat = findPrimaryCategory(['cloud-platform', 'kubernetes'])
    expect(cat).toBeDefined()
    expect(cat!.label).toBe('Cloud & Platform')
  })

  it('should return null when no category tag is found', () => {
    const cat = findPrimaryCategory(['random-tag', 'unknown'])
    expect(cat).toBeNull()
  })

  it('should return the first matching category', () => {
    const cat = findPrimaryCategory(['craft', 'architecture'])
    expect(cat!.value).toBe('craft')
  })
})

describe('breadcrumbs - items generation (TASK-030)', () => {
  it('should generate Accueil > Category > Article for article with category', () => {
    const items = generateBreadcrumbItems(
      'Mon Article',
      '/blogs/mon-article',
      ['craft', 'testing'],
      'https://blog.hoppr.tech',
    )

    expect(items).toHaveLength(3)
    expect(items[0].name).toBe('Accueil')
    expect(items[1].name).toBe('Craft')
    expect(items[1].url).toBe('https://blog.hoppr.tech/categories/craft')
    expect(items[2].name).toBe('Mon Article')
  })

  it('should generate Accueil > Article when no category matches', () => {
    const items = generateBreadcrumbItems(
      'Mon Article',
      '/blogs/mon-article',
      ['random-tag'],
      'https://blog.hoppr.tech',
    )

    expect(items).toHaveLength(2)
    expect(items[0].name).toBe('Accueil')
    expect(items[1].name).toBe('Mon Article')
  })

  it('should produce BreadcrumbList JSON-LD structure', () => {
    const items = generateBreadcrumbItems(
      'Mon Article',
      '/blogs/mon-article',
      ['craft'],
      'https://blog.hoppr.tech',
    )

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url,
      })),
    }

    expect(jsonLd['@type']).toBe('BreadcrumbList')
    expect(jsonLd.itemListElement).toHaveLength(3)
    expect(jsonLd.itemListElement[0].position).toBe(1)
    expect(jsonLd.itemListElement[0].name).toBe('Accueil')
  })
})
