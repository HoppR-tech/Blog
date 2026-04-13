import { describe, expect, it } from 'bun:test'
import { getLastHeadCall, setupSeoMocks } from '@/tests/seo/test-helpers'

const { mockUseHead } = setupSeoMocks()

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
    const call = getLastHeadCall(mockUseHead)
    const scriptTag = call.script.find((s: { type?: string }) => s.type === 'application/ld+json')
    const parsed = JSON.parse(scriptTag?.innerHTML ?? '{}')

    // Then: we find Organization and WebSite schemas
    const org = parsed['@graph'].find((item: { '@type': string }) => item['@type'] === 'Organization')
    const website = parsed['@graph'].find((item: { '@type': string }) => item['@type'] === 'WebSite')

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
