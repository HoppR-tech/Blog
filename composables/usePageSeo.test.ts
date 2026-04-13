import { describe, expect, it } from 'bun:test'
import { getLastHeadCall, setupSeoMocks } from '@/tests/seo/test-helpers'

const { mockUseHead } = setupSeoMocks()

const { usePageSeo } = await import('./usePageSeo')

describe('usePageSeo', () => {
  it('should set og:site_name to "Blog HoppR"', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
    })

    const call = getLastHeadCall(mockUseHead)
    const ogSiteName = call.meta.find((m: { property?: string }) => m.property === 'og:site_name')
    expect(ogSiteName?.content).toBe('Blog HoppR')
  })

  it('should set og:locale to "fr_FR"', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
    })

    const call = getLastHeadCall(mockUseHead)
    const ogLocale = call.meta.find((m: { property?: string }) => m.property === 'og:locale')
    expect(ogLocale?.content).toBe('fr_FR')
  })

  it('should generate absolute canonical URL', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
    })

    const call = getLastHeadCall(mockUseHead)
    expect(call.link[0]).toEqual({
      rel: 'canonical',
      href: 'https://blog.hoppr.tech/blogs/test',
    })
  })

  it('should set og:image and twitter:image as absolute URLs', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
      image: '/content-assets/slug/assets/cover.webp',
    })

    const call = getLastHeadCall(mockUseHead)
    const ogImage = call.meta.find((m: { property?: string }) => m.property === 'og:image')
    const twitterImage = call.meta.find((m: { name?: string }) => m.name === 'twitter:image')

    expect(ogImage?.content).toBe('https://blog.hoppr.tech/content-assets/slug/assets/cover.webp')
    expect(twitterImage?.content).toBe('https://blog.hoppr.tech/content-assets/slug/assets/cover.webp')
  })

  it('should not include og:image when no image provided', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
    })

    const call = getLastHeadCall(mockUseHead)
    const ogImage = call.meta.find((m: { property?: string }) => m.property === 'og:image')
    expect(ogImage).toBeUndefined()
  })

  it('should set og:type to "article" when specified', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
      type: 'article',
    })

    const call = getLastHeadCall(mockUseHead)
    const ogType = call.meta.find((m: { property?: string }) => m.property === 'og:type')
    expect(ogType?.content).toBe('article')
  })

  it('should default og:type to "website"', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
    })

    const call = getLastHeadCall(mockUseHead)
    const ogType = call.meta.find((m: { property?: string }) => m.property === 'og:type')
    expect(ogType?.content).toBe('website')
  })

  it('should include article:published_time when provided', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
      publishedTime: '2024-06-10',
    })

    const call = getLastHeadCall(mockUseHead)
    const publishedTime = call.meta.find((m: { property?: string }) => m.property === 'article:published_time')
    expect(publishedTime?.content).toBe('2024-06-10')
  })

  it('should include article:author for each author', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
      authors: ['Alice', 'Bob'],
    })

    const call = getLastHeadCall(mockUseHead)
    const authorMeta = call.meta.filter((m: { property?: string }) => m.property === 'article:author')
    expect(authorMeta).toHaveLength(2)
    expect(authorMeta[0]?.content).toBe('Alice')
    expect(authorMeta[1]?.content).toBe('Bob')
  })

  it('should include JSON-LD script when provided', () => {
    const jsonLd = { '@context': 'https://schema.org', '@type': 'BlogPosting' }
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
      jsonLd,
    })

    const call = getLastHeadCall(mockUseHead)
    expect(call.script[0]).toEqual({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd),
    })
  })

  it('should add noindex meta when noindex is true', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/tags/obscure',
      noindex: true,
    })

    const call = getLastHeadCall(mockUseHead)
    const robots = call.meta.find((m: { name?: string }) => m.name === 'robots')
    expect(robots?.content).toBe('noindex, follow')
  })

  it('should not add noindex meta when noindex is false', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/tags/popular',
      noindex: false,
    })

    const call = getLastHeadCall(mockUseHead)
    const robots = call.meta.find((m: { name?: string }) => m.name === 'robots')
    expect(robots).toBeUndefined()
  })
})
