/**
 * Single source of truth for the HoppR Organization JSON-LD entity.
 *
 * Reused on the homepage (@graph), in BlogPosting.publisher, and on /a-propos
 * to guarantee consistent signals across the site (E-A-T, knowledge graph).
 *
 * When updating HoppR's identity (new social, slogan, logo size...), edit here
 * and every consumer picks it up.
 */

export interface OrganizationJsonLd {
  '@type': 'Organization'
  '@id': string
  'name': string
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
}

const HOPPR_SOCIAL_PROFILES = [
  'https://github.com/HoppR-tech',
  'https://www.linkedin.com/company/hopprtech',
  'https://twitter.com/HoppR_Tech',
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
  'Data Engineering',
]

/**
 * Build the canonical HoppR Organization JSON-LD entity.
 *
 * @param baseUrl - blog absolute URL (e.g. https://blog.hoppr.tech)
 */
export function buildOrganizationJsonLd(baseUrl: string): OrganizationJsonLd {
  const trimmedBase = baseUrl.replace(TRAILING_SLASH, '')

  return {
    '@type': 'Organization',
    '@id': 'https://hoppr.tech/#organization',
    'name': 'HoppR',
    'url': 'https://hoppr.tech',
    'logo': {
      '@type': 'ImageObject',
      'url': `${trimmedBase}/hoppr.png`,
      'width': 512,
      'height': 512,
    },
    'sameAs': HOPPR_SOCIAL_PROFILES,
    'description': 'HoppR — ESN lyonnaise spécialisée Software Craftsmanship, Cloud et Platform Engineering.',
    'slogan': 'Plus que du code, du craft.',
    'knowsAbout': HOPPR_EXPERTISE,
  }
}

/**
 * Compact publisher reference for use inside BlogPosting.publisher.
 * Includes the minimum required by schema.org while pointing to the full Org via @id.
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
