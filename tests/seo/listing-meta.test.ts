import { describe, expect, it } from 'bun:test'
import { getLastHeadCall, setupSeoMocks } from '@/tests/seo/test-helpers'

const { mockUseHead } = setupSeoMocks()

const { usePageSeo } = await import('@/composables/usePageSeo')

describe('listing pages meta - OG tags (TASK-021)', () => {
  it('should set specific og:url for /blogs page', () => {
    // Given: the /blogs listing page
    usePageSeo({
      title: 'Tous nos Articles',
      description: 'Toutes les publications sur le blog d\'HoppR sont ici.',
      url: '/blogs',
    })

    // When: we analyze OG meta
    const call = getLastHeadCall(mockUseHead)
    const ogUrl = call.meta.find((m: { property?: string }) => m.property === 'og:url')
    const ogTitle = call.meta.find((m: { property?: string }) => m.property === 'og:title')
    const ogDesc = call.meta.find((m: { property?: string }) => m.property === 'og:description')

    // Then: og:url is specific to /blogs, title and description are not default
    expect(ogUrl?.content).toBe('https://blog.hoppr.tech/blogs')
    expect(ogTitle?.content).toContain('Articles')
    expect(ogDesc?.content).not.toBe('')
  })

  it('should set specific og:url for /tags page', () => {
    usePageSeo({
      title: 'Tags',
      description: 'Tous les sujets sur lesquels nous avons écrit.',
      url: '/tags',
    })

    const call = getLastHeadCall(mockUseHead)
    const ogUrl = call.meta.find((m: { property?: string }) => m.property === 'og:url')
    expect(ogUrl?.content).toBe('https://blog.hoppr.tech/tags')
  })

  it('should set specific og:url for /categories page', () => {
    usePageSeo({
      title: 'Catégories',
      description: 'Nos catégories.',
      url: '/categories',
    })

    const call = getLastHeadCall(mockUseHead)
    const ogUrl = call.meta.find((m: { property?: string }) => m.property === 'og:url')
    expect(ogUrl?.content).toBe('https://blog.hoppr.tech/categories')
  })

  it('should set specific og:url for /tags/craft page', () => {
    usePageSeo({
      title: 'Craft',
      description: 'Articles sur le thème Craft.',
      url: '/tags/craft',
    })

    const call = getLastHeadCall(mockUseHead)
    const ogUrl = call.meta.find((m: { property?: string }) => m.property === 'og:url')
    expect(ogUrl?.content).toBe('https://blog.hoppr.tech/tags/craft')
  })

  it('should set specific og:url for /categories/craft page', () => {
    usePageSeo({
      title: 'Articles Craft',
      description: 'Articles dans la catégorie Craft.',
      url: '/categories/craft',
    })

    const call = getLastHeadCall(mockUseHead)
    const ogUrl = call.meta.find((m: { property?: string }) => m.property === 'og:url')
    expect(ogUrl?.content).toBe('https://blog.hoppr.tech/categories/craft')
  })
})
