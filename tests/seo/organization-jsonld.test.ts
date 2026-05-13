import { describe, expect, it } from 'bun:test'
import { buildOrganizationJsonLd, buildPublisherJsonLd } from '@/utils/organization'

describe('buildOrganizationJsonLd', () => {
  const baseUrl = 'https://blog.hoppr.tech'

  it('returns a fully formed Organization with stable @id', () => {
    const org = buildOrganizationJsonLd(baseUrl)

    expect(org['@type']).toBe('Organization')
    expect(org['@id']).toBe('https://hoppr.tech/#organization')
    expect(org.name).toBe('HoppR')
    expect(org.url).toBe('https://hoppr.tech')
  })

  it('exposes logo as an ImageObject with explicit dimensions', () => {
    const org = buildOrganizationJsonLd(baseUrl)

    expect(org.logo['@type']).toBe('ImageObject')
    expect(org.logo.url).toBe('https://blog.hoppr.tech/hoppr.png')
    expect(org.logo.width).toBe(512)
    expect(org.logo.height).toBe(512)
  })

  it('strips a trailing slash from the base URL before building the logo URL', () => {
    const org = buildOrganizationJsonLd('https://blog.hoppr.tech/')
    expect(org.logo.url).toBe('https://blog.hoppr.tech/hoppr.png')
  })

  it('exposes the social profiles in sameAs (LinkedIn, GitHub, X)', () => {
    const org = buildOrganizationJsonLd(baseUrl)

    expect(org.sameAs).toBeInstanceOf(Array)
    expect(org.sameAs.length).toBeGreaterThanOrEqual(3)
    expect(org.sameAs).toContain('https://github.com/HoppR-tech')
    expect(org.sameAs).toContain('https://www.linkedin.com/company/hopprtech')
    expect(org.sameAs).toContain('https://twitter.com/HoppR_Tech')
  })

  it('exposes knowsAbout with HoppR thematics for LLM knowledge graphs', () => {
    const org = buildOrganizationJsonLd(baseUrl)

    expect(org.knowsAbout).toBeInstanceOf(Array)
    expect(org.knowsAbout).toContain('Software Craftsmanship')
    expect(org.knowsAbout).toContain('Cloud Computing')
  })
})

describe('buildPublisherJsonLd', () => {
  const baseUrl = 'https://blog.hoppr.tech'

  it('returns a compact publisher pointing to the canonical Organization via @id', () => {
    const publisher = buildPublisherJsonLd(baseUrl)

    expect(publisher['@type']).toBe('Organization')
    expect(publisher['@id']).toBe('https://hoppr.tech/#organization')
    expect(publisher.name).toBe('HoppR')
    expect(publisher.url).toBe('https://hoppr.tech')
    expect(publisher.logo['@type']).toBe('ImageObject')
    expect(publisher.logo.url).toBe('https://blog.hoppr.tech/hoppr.png')
  })
})
