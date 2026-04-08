import { describe, expect, it, mock } from 'bun:test'

const mockUseRuntimeConfig = mock(() => ({
  public: { baseUrl: 'https://blog.hoppr.tech' },
}))

const mockUseHead = mock(() => {})

;(globalThis as any).useRuntimeConfig = mockUseRuntimeConfig
;(globalThis as any).useHead = mockUseHead

const { usePageSeo } = await import('./usePageSeo')

describe('usePageSeo', () => {
  it('should set og:site_name to "Blog HoppR"', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
    })

    const call = mockUseHead.mock.lastCall![0]
    const ogSiteName = call.meta.find((m: any) => m.property === 'og:site_name')
    expect(ogSiteName.content).toBe('Blog HoppR')
  })

  it('should set og:locale to "fr_FR"', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
    })

    const call = mockUseHead.mock.lastCall![0]
    const ogLocale = call.meta.find((m: any) => m.property === 'og:locale')
    expect(ogLocale.content).toBe('fr_FR')
  })

  it('should generate absolute canonical URL', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
    })

    const call = mockUseHead.mock.lastCall![0]
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

    const call = mockUseHead.mock.lastCall![0]
    const ogImage = call.meta.find((m: any) => m.property === 'og:image')
    const twitterImage = call.meta.find((m: any) => m.name === 'twitter:image')

    expect(ogImage.content).toBe('https://blog.hoppr.tech/content-assets/slug/assets/cover.webp')
    expect(twitterImage.content).toBe('https://blog.hoppr.tech/content-assets/slug/assets/cover.webp')
  })

  it('should not include og:image when no image provided', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
    })

    const call = mockUseHead.mock.lastCall![0]
    const ogImage = call.meta.find((m: any) => m.property === 'og:image')
    expect(ogImage).toBeUndefined()
  })

  it('should set og:type to "article" when specified', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
      type: 'article',
    })

    const call = mockUseHead.mock.lastCall![0]
    const ogType = call.meta.find((m: any) => m.property === 'og:type')
    expect(ogType.content).toBe('article')
  })

  it('should default og:type to "website"', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
    })

    const call = mockUseHead.mock.lastCall![0]
    const ogType = call.meta.find((m: any) => m.property === 'og:type')
    expect(ogType.content).toBe('website')
  })

  it('should include article:published_time when provided', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
      publishedTime: '2024-06-10',
    })

    const call = mockUseHead.mock.lastCall![0]
    const publishedTime = call.meta.find((m: any) => m.property === 'article:published_time')
    expect(publishedTime.content).toBe('2024-06-10')
  })

  it('should include article:author for each author', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
      authors: ['Alice', 'Bob'],
    })

    const call = mockUseHead.mock.lastCall![0]
    const authorMeta = call.meta.filter((m: any) => m.property === 'article:author')
    expect(authorMeta).toHaveLength(2)
    expect(authorMeta[0].content).toBe('Alice')
    expect(authorMeta[1].content).toBe('Bob')
  })

  it('should include JSON-LD script when provided', () => {
    const jsonLd = { '@context': 'https://schema.org', '@type': 'BlogPosting' }
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/blogs/test',
      jsonLd,
    })

    const call = mockUseHead.mock.lastCall![0]
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

    const call = mockUseHead.mock.lastCall![0]
    const robots = call.meta.find((m: any) => m.name === 'robots')
    expect(robots.content).toBe('noindex, follow')
  })

  it('should not add noindex meta when noindex is false', () => {
    usePageSeo({
      title: 'Test',
      description: 'Desc',
      url: '/tags/popular',
      noindex: false,
    })

    const call = mockUseHead.mock.lastCall![0]
    const robots = call.meta.find((m: any) => m.name === 'robots')
    expect(robots).toBeUndefined()
  })
})
