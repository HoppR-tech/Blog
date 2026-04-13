import { describe, expect, it } from 'bun:test'
import { getLastHeadCall, setupSeoMocks } from '@/tests/seo/test-helpers'

const { mockUseHead } = setupSeoMocks()

const { usePageSeo } = await import('@/composables/usePageSeo')

describe('canonical URLs on pages (TASK-012)', () => {
  it('should set canonical on homepage', () => {
    usePageSeo({
      title: 'Home',
      description: 'Blog HoppR',
      url: '/',
    })

    const call = getLastHeadCall(mockUseHead)
    const canonical = call.link.find((l: { rel?: string }) => l.rel === 'canonical')
    expect(canonical?.href).toBe('https://blog.hoppr.tech/')
  })

  it('should set canonical on /blogs', () => {
    usePageSeo({
      title: 'Articles',
      description: 'Tous nos articles',
      url: '/blogs',
    })

    const call = getLastHeadCall(mockUseHead)
    const canonical = call.link.find((l: { rel?: string }) => l.rel === 'canonical')
    expect(canonical?.href).toBe('https://blog.hoppr.tech/blogs')
  })

  it('should set canonical on /tags', () => {
    usePageSeo({
      title: 'Tags',
      description: 'Tous les tags',
      url: '/tags',
    })

    const call = getLastHeadCall(mockUseHead)
    const canonical = call.link.find((l: { rel?: string }) => l.rel === 'canonical')
    expect(canonical?.href).toBe('https://blog.hoppr.tech/tags')
  })

  it('should set canonical on /categories', () => {
    usePageSeo({
      title: 'Categories',
      description: 'Toutes les categories',
      url: '/categories',
    })

    const call = getLastHeadCall(mockUseHead)
    const canonical = call.link.find((l: { rel?: string }) => l.rel === 'canonical')
    expect(canonical?.href).toBe('https://blog.hoppr.tech/categories')
  })

  it('should set canonical on /tags/craft', () => {
    usePageSeo({
      title: 'Craft',
      description: 'Articles craft',
      url: '/tags/craft',
    })

    const call = getLastHeadCall(mockUseHead)
    const canonical = call.link.find((l: { rel?: string }) => l.rel === 'canonical')
    expect(canonical?.href).toBe('https://blog.hoppr.tech/tags/craft')
  })

  it('should set canonical on /categories/craft', () => {
    usePageSeo({
      title: 'Craft',
      description: 'Articles craft',
      url: '/categories/craft',
    })

    const call = getLastHeadCall(mockUseHead)
    const canonical = call.link.find((l: { rel?: string }) => l.rel === 'canonical')
    expect(canonical?.href).toBe('https://blog.hoppr.tech/categories/craft')
  })
})
