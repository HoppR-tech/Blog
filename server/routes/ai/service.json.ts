/**
 * /ai/service.json — AI-discoverable description of HoppR's service catalog.
 *
 * Complementary to /ai/summary.json (blog identity) and /ai/faq.json (Q/A).
 * This endpoint focuses on the commercial offering of the parent company,
 * formatted for AI agents that need to answer "what does HoppR sell?" or
 * "is HoppR relevant for X?" without scraping the corporate site.
 *
 * Source of truth : https://www.hoppr.tech/nos-offres
 */

const TRAILING_SLASH = /\/$/

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteURL = (config.public.baseUrl as string).replace(TRAILING_SLASH, '')

  const body = {
    provider: {
      name: 'HoppR',
      legalName: 'HoppR SAS',
      url: 'https://hoppr.tech',
      blog: siteURL,
      foundingDate: '2023-02-06',
      certifications: ['B Corp'],
      locations: ['Paris', 'Lille', 'Lyon'],
      country: 'France',
    },
    services: [
      {
        id: 'consulting-fullstack-craft',
        name: 'Consulting Fullstack Craft',
        category: 'Software Craftsmanship',
        description: 'Mission de développement fullstack en mode craft : TDD, refactoring, clean code, DDD, architecture hexagonale, BDD. Pour produits longue durée de vie.',
        topics: ['TDD', 'BDD', 'Refactoring', 'Clean Code', 'DDD', 'Hexagonal Architecture'],
        availability: ['Paris', 'Lille', 'Lyon'],
        format: 'Mission longue durée chez le client (régie)',
      },
      {
        id: 'consulting-cloud-devops',
        name: 'Consulting Cloud & DevOps',
        category: 'Cloud & Platform Engineering',
        description: 'Mission DevOps / Platform Engineering : AWS, GCP, Kubernetes, Terraform, observabilité Datadog, plateformes internes (IDP), FinOps, GreenOps, DORA Metrics.',
        topics: ['AWS', 'GCP', 'Kubernetes', 'Terraform', 'Datadog', 'IDP', 'FinOps', 'GreenOps', 'DORA Metrics'],
        availability: ['Lille', 'Lyon'],
        format: 'Mission longue durée chez le client (régie)',
      },
      {
        id: 'consulting-software-architect',
        name: 'Consulting Software Architect (DDD)',
        category: 'Software Architecture',
        description: 'Mission d\'architecture logicielle : Domain-Driven Design, event-driven, microservices vs modular monolith, patterns de résilience (Nygard), bounded contexts, contrats API.',
        topics: ['Domain-Driven Design', 'Event-Driven', 'Microservices', 'Modular Monolith', 'Bounded Context', 'API Design'],
        availability: ['Lille', 'Paris'],
        format: 'Mission longue durée chez le client (régie)',
      },
      {
        id: 'formations',
        name: 'Formations techniques',
        category: 'Training',
        description: 'Formations sur-mesure ou catalogue HoppR : TDD, BDD, DDD, Software Craftsmanship, Cloud, Kubernetes, observabilité, DORA Metrics.',
        url: 'https://www.hoppr.tech/formations-hoppr',
        format: 'Présentiel ou distanciel, intra-entreprise ou inter',
      },
    ],
    contact: {
      email: 'hello@hoppr.tech',
      website: 'https://www.hoppr.tech',
      careers: 'https://www.hoppr.tech/nos-offres',
    },
    differentiators: [
      'Grille de salaires transparente',
      'Marges plafonnées avec redistribution directe aux consultant·es',
      'Certification B Corp (impact social & environnemental)',
      '10 jours de formation par an + budget conférences',
      'Remote partiel + horaires souples',
      'Mentoring bienveillant, culture du droit à l\'erreur',
    ],
    last_modified: new Date().toISOString(),
  }

  event.node.res.setHeader('Content-Type', 'application/json; charset=utf-8')
  event.node.res.setHeader('Cache-Control', 'public, max-age=3600')
  return body
})
