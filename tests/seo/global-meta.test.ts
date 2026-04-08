import { describe, expect, it, mock } from 'bun:test'

const mockUseRuntimeConfig = mock(() => ({
  public: { baseUrl: 'https://blog.hoppr.tech' },
}))

const mockUseHead = mock(() => {})

;(globalThis as any).useRuntimeConfig = mockUseRuntimeConfig
;(globalThis as any).useHead = mockUseHead

const { usePageSeo } = await import('@/composables/usePageSeo')

describe('global meta - og:site_name (TASK-008)', () => {
  it('should set og:site_name to "Blog HoppR" on any page', () => {
    // Given: any page of the blog
    usePageSeo({
      title: 'Page Title',
      description: 'Page description',
      url: '/blogs',
    })

    // When: we analyze OG meta
    const call = mockUseHead.mock.lastCall![0]
    const ogSiteName = call.meta.find((m: any) => m.property === 'og:site_name')

    // Then: og:site_name = "Blog HoppR" (not a URL)
    expect(ogSiteName.content).toBe('Blog HoppR')
    expect(ogSiteName.content).not.toContain('http')
  })
})

describe('global meta - no og:image conflict (TASK-010)', () => {
  it('should not produce conflicting og:image and og:image:secure_url', () => {
    // Given: any page
    usePageSeo({
      title: 'Page Title',
      description: 'Page description',
      url: '/blogs/test',
      image: '/content-assets/slug/assets/cover.webp',
    })

    // When: we analyze OG meta
    const call = mockUseHead.mock.lastCall![0]

    // Then: there should be no og:image:secure_url pointing to a different image
    const ogImageSecure = call.meta.find((m: any) => m.property === 'og:image:secure_url')
    const ogImage = call.meta.find((m: any) => m.property === 'og:image')

    // Either no secure_url at all, or it matches og:image
    if (ogImageSecure) {
      expect(ogImageSecure.content).toBe(ogImage.content)
    }
    else {
      expect(ogImageSecure).toBeUndefined()
    }
  })
})
