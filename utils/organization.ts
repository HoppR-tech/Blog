/**
 * Single source of truth for the HoppR Organization JSON-LD entity.
 *
 * Reused on the homepage (@graph), in BlogPosting.publisher, and on /a-propos
 * to guarantee consistent signals across the site (E-A-T, knowledge graph).
 *
 * When updating HoppR's identity (new social, slogan, logo size...), edit here
 * and every consumer picks it up.
 */

export interface PostalAddress {
  '@type': 'PostalAddress'
  'addressLocality': string
  'addressRegion'?: string
  'addressCountry': string
}

export interface ContactPoint {
  '@type': 'ContactPoint'
  'contactType': string
  'email': string
  'areaServed': string[]
  'availableLanguage': string[]
}

export interface NumberOfEmployees {
  '@type': 'QuantitativeValue'
  'value': number
  'minValue'?: number
  'unitText': string
}

export interface OrganizationJsonLd {
  '@context': 'https://schema.org'
  '@type': 'Organization'
  '@id': string
  'name': string
  'legalName': string
  'url': string
  'logo': {
    '@type': 'ImageObject'
    'url': string
    'width': number
    'height': number
  }
  'sameAs': string[]
  'description': string
  'slogan': string
  'knowsAbout': string[]
  'foundingDate': string
  'email': string
  'address': PostalAddress[]
  'areaServed': string[]
  'hasCredential': {
    '@type': 'EducationalOccupationalCredential'
    'name': string
    'credentialCategory': string
    'url': string
  }
  'contactPoint': ContactPoint[]
  'numberOfEmployees': NumberOfEmployees
}

const HOPPR_SOCIAL_PROFILES = [
  'https://github.com/HoppR-tech',
  'https://www.linkedin.com/company/hopprtech',
  'https://twitter.com/HoppR_Tech',
  'https://www.youtube.com/@HoppR-Tech',
]

const HOPPR_LOCATIONS: PostalAddress[] = [
  { '@type': 'PostalAddress', 'addressLocality': 'Paris', 'addressCountry': 'FR' },
  { '@type': 'PostalAddress', 'addressLocality': 'Lille', 'addressCountry': 'FR' },
  { '@type': 'PostalAddress', 'addressLocality': 'Lyon', 'addressCountry': 'FR' },
]

const TRAILING_SLASH = /\/$/

const HOPPR_EXPERTISE = [
  'Software Craftsmanship',
  'Cloud Computing',
  'Software Architecture',
  'Domain-Driven Design',
  'DevOps',
  'Platform Engineering',
  'Observability',
  'GreenOps',
  'FinOps',
]

/**
 * Build the canonical HoppR Organization JSON-LD entity.
 *
 * @param baseUrl - blog absolute URL (e.g. https://blog.hoppr.tech)
 */
export function buildOrganizationJsonLd(baseUrl: string): OrganizationJsonLd {
  const trimmedBase = baseUrl.replace(TRAILING_SLASH, '')

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://hoppr.tech/#organization',
    'name': 'HoppR',
    'legalName': 'HoppR SAS',
    'url': 'https://hoppr.tech',
    'logo': {
      '@type': 'ImageObject',
      'url': `${trimmedBase}/hoppr.png`,
      'width': 512,
      'height': 512,
    },
    'sameAs': HOPPR_SOCIAL_PROFILES,
    'description': 'HoppR — ESN française certifiée B Corp, présente à Paris, Lille et Lyon. Spécialisée Software Craftsmanship, Cloud et Architecture logicielle.',
    'slogan': 'There is a New Hopp(R)',
    'knowsAbout': HOPPR_EXPERTISE,
    'foundingDate': '2025-09-15',
    'email': 'hello@hoppr.tech',
    'address': HOPPR_LOCATIONS,
    'areaServed': ['France'],
    'hasCredential': {
      '@type': 'EducationalOccupationalCredential',
      'name': 'B Corp Certification',
      'credentialCategory': 'certification',
      'url': 'https://www.bcorporation.net/en-us/find-a-b-corp/company/hoppr/',
    },
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'contactType': 'customer service',
        'email': 'hello@hoppr.tech',
        'areaServed': ['FR'],
        'availableLanguage': ['fr', 'en'],
      },
      {
        '@type': 'ContactPoint',
        'contactType': 'recruiting',
        'email': 'hello@hoppr.tech',
        'areaServed': ['FR'],
        'availableLanguage': ['fr', 'en'],
      },
    ],
    'numberOfEmployees': {
      '@type': 'QuantitativeValue',
      'value': 30,
      'minValue': 25,
      'unitText': 'consultants',
    },
  }
}

/**
 * Compact publisher reference for use inside BlogPosting.publisher.
 * Includes the minimum required by schema.org while pointing to the full Org via @id.
 * @context omitted on purpose — publisher is always nested inside a parent
 * BlogPosting which carries its own @context.
 */
export function buildPublisherJsonLd(baseUrl: string): {
  '@type': 'Organization'
  '@id': string
  'name': string
  'url': string
  'logo': { '@type': 'ImageObject', 'url': string, 'width': number, 'height': number }
} {
  const org = buildOrganizationJsonLd(baseUrl)
  return {
    '@type': 'Organization',
    '@id': org['@id'],
    'name': org.name,
    'url': org.url,
    'logo': org.logo,
  }
}

export interface AboutPageJsonLd {
  '@context': 'https://schema.org'
  '@graph': Array<OrganizationJsonLd | {
    '@context': 'https://schema.org'
    '@type': 'AboutPage'
    '@id': string
    'url': string
    'name': string
    'inLanguage': 'fr-FR'
    'isPartOf': { '@id': string }
    'about': { '@id': string }
    'mainEntity': { '@id': string }
  } | {
    '@context': 'https://schema.org'
    '@type': 'WebSite'
    '@id': string
    'url': string
    'name': string
    'inLanguage': 'fr-FR'
    'publisher': { '@id': string }
  }>
}

/**
 * Builds the full JSON-LD graph for the /a-propos page, exposing:
 * - the canonical HoppR Organization (E-A-T, knowledge graph)
 * - the WebSite entity (cohérence avec la home)
 * - the AboutPage entity (mainEntity → Organization)
 */
export function buildAboutPageJsonLd(baseUrl: string): AboutPageJsonLd {
  const trimmedBase = baseUrl.replace(TRAILING_SLASH, '')
  const org = buildOrganizationJsonLd(baseUrl)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      org,
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${trimmedBase}/#website`,
        'url': trimmedBase,
        'name': 'Blog HoppR',
        'inLanguage': 'fr-FR',
        'publisher': { '@id': org['@id'] },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        '@id': `${trimmedBase}/a-propos#aboutpage`,
        'url': `${trimmedBase}/a-propos`,
        'name': 'À propos de HoppR',
        'inLanguage': 'fr-FR',
        'isPartOf': { '@id': `${trimmedBase}/#website` },
        'about': { '@id': org['@id'] },
        'mainEntity': { '@id': org['@id'] },
      },
    ],
  }
}
