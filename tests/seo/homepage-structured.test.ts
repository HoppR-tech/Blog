import { describe, expect, it, mock } from 'bun:test'

const mockUseRuntimeConfig = mock(() => ({
  public: { baseUrl: 'https://blog.hoppr.tech' },
}))

const mockUseHead = mock(() => {})

;(globalThis as any).useRuntimeConfig = mockUseRuntimeConfig
;(globalThis as any).useHead = mockUseHead

const { usePageSeo } = await import('@/composables/usePageSeo')

describe('homepage structured data - Organization + WebSite (TASK-028)', () => {
  it('should include Organization and WebSite in JSON-LD @graph', () => {
    // Given: the homepage with JSON-LD
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          'name': 'HoppR',
          'url': 'https://hoppr.tech',
          'logo': 'https://blog.hoppr.tech/hoppr.png',
          'sameAs': [
            'https://github.com/HoppR-tech',
            'https://www.linkedin.com/company/hopprtech',
            'https://twitter.com/HoppR_Tech',
          ],
        },
        {
          '@type': 'WebSite',
          'name': 'Blog HoppR',
          'url': 'https://blog.hoppr.tech',
          'description': 'Blog technique de la communauté HoppR',
        },
      ],
    }

    usePageSeo({
      title: 'Software Craftsmanship, Cloud & Architecture',
      description: 'Blog HoppR',
      url: '/',
      jsonLd,
    })

    // When: we parse the JSON-LD script
    const call = mockUseHead.mock.lastCall![0]
    const scriptTag = call.script.find((s: any) => s.type === 'application/ld+json')
    const parsed = JSON.parse(scriptTag.innerHTML)

    // Then: we find Organization and WebSite schemas
    const org = parsed['@graph'].find((item: any) => item['@type'] === 'Organization')
    const website = parsed['@graph'].find((item: any) => item['@type'] === 'WebSite')

    expect(org).toBeDefined()
    expect(org.name).toBe('HoppR')
    expect(org.logo).toMatch(/^https:\/\//)
    expect(org.url).toBeTruthy()
    expect(org.sameAs).toBeInstanceOf(Array)
    expect(org.sameAs.length).toBeGreaterThan(0)

    expect(website).toBeDefined()
    expect(website.name).toBe('Blog HoppR')
    expect(website.url).toBe('https://blog.hoppr.tech')
  })
})
