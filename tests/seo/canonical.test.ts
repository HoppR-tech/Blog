import { describe, expect, it, mock } from 'bun:test'

const mockUseRuntimeConfig = mock(() => ({
  public: { baseUrl: 'https://blog.hoppr.tech' },
}))

const mockUseHead = mock(() => {})

;(globalThis as any).useRuntimeConfig = mockUseRuntimeConfig
;(globalThis as any).useHead = mockUseHead

const { usePageSeo } = await import('@/composables/usePageSeo')

describe('canonical URLs on pages (TASK-012)', () => {
  it('should set canonical on homepage', () => {
    usePageSeo({
      title: 'Home',
      description: 'Blog HoppR',
      url: '/',
    })

    const call = mockUseHead.mock.lastCall![0]
    const canonical = call.link.find((l: any) => l.rel === 'canonical')
    expect(canonical.href).toBe('https://blog.hoppr.tech/')
  })

  it('should set canonical on /blogs', () => {
    usePageSeo({
      title: 'Articles',
      description: 'Tous nos articles',
      url: '/blogs',
    })

    const call = mockUseHead.mock.lastCall![0]
    const canonical = call.link.find((l: any) => l.rel === 'canonical')
    expect(canonical.href).toBe('https://blog.hoppr.tech/blogs')
  })

  it('should set canonical on /tags', () => {
    usePageSeo({
      title: 'Tags',
      description: 'Tous les tags',
      url: '/tags',
    })

    const call = mockUseHead.mock.lastCall![0]
    const canonical = call.link.find((l: any) => l.rel === 'canonical')
    expect(canonical.href).toBe('https://blog.hoppr.tech/tags')
  })

  it('should set canonical on /categories', () => {
    usePageSeo({
      title: 'Categories',
      description: 'Toutes les categories',
      url: '/categories',
    })

    const call = mockUseHead.mock.lastCall![0]
    const canonical = call.link.find((l: any) => l.rel === 'canonical')
    expect(canonical.href).toBe('https://blog.hoppr.tech/categories')
  })

  it('should set canonical on /tags/craft', () => {
    usePageSeo({
      title: 'Craft',
      description: 'Articles craft',
      url: '/tags/craft',
    })

    const call = mockUseHead.mock.lastCall![0]
    const canonical = call.link.find((l: any) => l.rel === 'canonical')
    expect(canonical.href).toBe('https://blog.hoppr.tech/tags/craft')
  })

  it('should set canonical on /categories/craft', () => {
    usePageSeo({
      title: 'Craft',
      description: 'Articles craft',
      url: '/categories/craft',
    })

    const call = mockUseHead.mock.lastCall![0]
    const canonical = call.link.find((l: any) => l.rel === 'canonical')
    expect(canonical.href).toBe('https://blog.hoppr.tech/categories/craft')
  })
})
