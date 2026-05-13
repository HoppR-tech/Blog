import { describe, expect, it } from 'bun:test'
import { buildAboutPageJsonLd, buildOrganizationJsonLd, buildPublisherJsonLd } from '@/utils/organization'

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

  it('exposes the social profiles in sameAs (LinkedIn, GitHub, X, YouTube)', () => {
    const org = buildOrganizationJsonLd(baseUrl)

    expect(org.sameAs).toBeInstanceOf(Array)
    expect(org.sameAs.length).toBeGreaterThanOrEqual(4)
    expect(org.sameAs).toContain('https://github.com/HoppR-tech')
    expect(org.sameAs).toContain('https://www.linkedin.com/company/hopprtech')
    expect(org.sameAs).toContain('https://twitter.com/HoppR_Tech')
    expect(org.sameAs).toContain('https://www.youtube.com/@HoppR-Tech')
  })

  it('exposes knowsAbout with HoppR thematics for LLM knowledge graphs', () => {
    const org = buildOrganizationJsonLd(baseUrl)

    expect(org.knowsAbout).toBeInstanceOf(Array)
    expect(org.knowsAbout).toContain('Software Craftsmanship')
    expect(org.knowsAbout).toContain('Cloud Computing')
    expect(org.knowsAbout).toContain('GreenOps')
    expect(org.knowsAbout).toContain('FinOps')
  })

  it('exposes legalName, foundingDate, email, address (Paris/Lille/Lyon) and slogan officiel', () => {
    const org = buildOrganizationJsonLd(baseUrl)

    expect(org.legalName).toBe('HoppR SAS')
    expect(org.foundingDate).toBe('2025-09-15')
    expect(org.email).toBe('hello@hoppr.tech')
    expect(org.slogan).toBe('There is a New Hopp(R)')

    expect(org.address).toBeInstanceOf(Array)
    expect(org.address).toHaveLength(3)
    const cities = org.address.map(a => a.addressLocality)
    expect(cities).toEqual(['Paris', 'Lille', 'Lyon'])
    for (const a of org.address)
      expect(a.addressCountry).toBe('FR')

    expect(org.areaServed).toContain('France')
  })

  it('exposes B Corp certification as a credential (EAT signal)', () => {
    const org = buildOrganizationJsonLd(baseUrl)

    expect(org.hasCredential['@type']).toBe('EducationalOccupationalCredential')
    expect(org.hasCredential.name).toBe('B Corp Certification')
    expect(org.hasCredential.url).toMatch(/bcorporation\.net/)
  })

  it('description mentions ESN française, B Corp, and the three cities', () => {
    const org = buildOrganizationJsonLd(baseUrl)
    const d = org.description.toLowerCase()
    expect(d).toContain('esn')
    expect(d).toContain('b corp')
    expect(d).toContain('paris')
    expect(d).toContain('lille')
    expect(d).toContain('lyon')
  })
})

describe('buildAboutPageJsonLd', () => {
  const baseUrl = 'https://blog.hoppr.tech'

  it('builds a graph with Organization + WebSite + AboutPage', () => {
    const ld = buildAboutPageJsonLd(baseUrl)
    expect(ld['@context']).toBe('https://schema.org')
    expect(ld['@graph']).toBeInstanceOf(Array)
    const types = ld['@graph'].map(n => n['@type'])
    expect(types).toContain('Organization')
    expect(types).toContain('WebSite')
    expect(types).toContain('AboutPage')
  })

  it('AboutPage mainEntity points to the canonical Organization via @id', () => {
    const ld = buildAboutPageJsonLd(baseUrl)
    const about = ld['@graph'].find(n => n['@type'] === 'AboutPage') as any
    expect(about.url).toBe('https://blog.hoppr.tech/a-propos')
    expect(about.inLanguage).toBe('fr-FR')
    expect(about.mainEntity['@id']).toBe('https://hoppr.tech/#organization')
    expect(about.about['@id']).toBe('https://hoppr.tech/#organization')
    expect(about.isPartOf['@id']).toBe('https://blog.hoppr.tech/#website')
  })

  it('WebSite publisher references the Organization via @id (consistency)', () => {
    const ld = buildAboutPageJsonLd(baseUrl)
    const website = ld['@graph'].find(n => n['@type'] === 'WebSite') as any
    expect(website.publisher['@id']).toBe('https://hoppr.tech/#organization')
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
