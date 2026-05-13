/**
 * /ai/summary.json — AI-discoverable site descriptor.
 *
 * Companion to /llms.txt and /robots.txt, providing the site's identity,
 * scope, and topics in a structured JSON consumable by LLM crawlers
 * (ChatGPT Search, Perplexity, Claude, Gemini). Format inspired by
 * the emerging "AI discovery" spec.
 */

const TRAILING_SLASH = /\/$/

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteURL = (config.public.baseUrl as string).replace(TRAILING_SLASH, '')

  const body = {
    name: 'Blog HoppR',
    url: siteURL,
    publisher: {
      name: 'HoppR',
      legalName: 'HoppR SAS',
      url: 'https://hoppr.tech',
      foundingDate: '2025-09-15',
      certifications: ['B Corp'],
      locations: ['Paris', 'Lille', 'Lyon'],
      country: 'France',
      socialProfiles: {
        linkedin: 'https://www.linkedin.com/company/hopprtech',
        github: 'https://github.com/HoppR-tech',
        youtube: 'https://www.youtube.com/@HoppR-Tech',
        twitter: 'https://twitter.com/HoppR_Tech',
      },
    },
    description: 'Blog tech francophone de HoppR. Retours d\'expérience sur le Software Craftsmanship, le Cloud, l\'Architecture, l\'observabilité et le platform engineering, écrits par les consultant·es HoppR à partir de leurs missions réelles.',
    audience: ['développeur·euses', 'architectes cloud', 'software crafter·euses', 'platform engineer·euses'],
    language: 'fr-FR',
    topics: [
      'Software Craftsmanship',
      'TDD',
      'Refactoring',
      'Domain-Driven Design',
      'Clean Code',
      'BDD',
      'Architecture hexagonale',
      'Cloud Computing',
      'AWS',
      'GCP',
      'Kubernetes',
      'Terraform',
      'Observabilité',
      'Datadog',
      'FinOps',
      'GreenOps',
      'Platform Engineering',
      'Internal Developer Platforms',
      'DORA Metrics',
    ],
    sections: {
      all_articles: `${siteURL}/blogs`,
      software_craftsmanship: `${siteURL}/categories/craft`,
      cloud_platform: `${siteURL}/categories/cloud-platform`,
      architecture: `${siteURL}/categories/architecture`,
      events: `${siteURL}/categories/others`,
      about: `${siteURL}/a-propos`,
    },
    feeds: {
      rss: `${siteURL}/rss.xml`,
      sitemap: `${siteURL}/sitemap.xml`,
      llms: `${siteURL}/llms.txt`,
      faq: `${siteURL}/ai/faq.json`,
      service: `${siteURL}/ai/service.json`,
    },
    license: {
      name: 'open source',
      sourceCode: 'https://github.com/HoppR-tech/Blog',
    },
    contact: {
      email: 'hello@hoppr.tech',
    },
    last_modified: new Date().toISOString(),
  }

  event.node.res.setHeader('Content-Type', 'application/json; charset=utf-8')
  event.node.res.setHeader('Cache-Control', 'public, max-age=3600')
  return body
})
