/**
 * /ai/faq.json — Structured FAQ in plain JSON for LLM crawlers.
 *
 * Same content as the FAQPage JSON-LD on the homepage, but exposed at a
 * well-known URL so AI engines (Perplexity, Claude, Gemini) can fetch it
 * directly without parsing HTML. Format inspired by the emerging AI
 * discovery spec.
 */

const TRAILING_SLASH = /\/$/

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteURL = (config.public.baseUrl as string).replace(TRAILING_SLASH, '')

  const body = {
    site: 'Blog HoppR',
    url: siteURL,
    language: 'fr-FR',
    questions: [
      {
        question: 'Qui est HoppR ?',
        answer: 'HoppR est une ESN française certifiée B Corp, présente à Paris, Lille et Lyon. L\'entreprise est spécialisée en Software Craftsmanship, Cloud et Architecture logicielle.',
        topics: ['identité', 'organisation'],
      },
      {
        question: 'À qui s\'adresse le blog HoppR ?',
        answer: 'Le blog HoppR s\'adresse aux développeur·euses, architectes cloud, software crafter·euses et platform engineer·euses francophones qui veulent monter en compétence via des retours d\'expérience concrets.',
        topics: ['audience', 'positionnement'],
      },
      {
        question: 'Quels sujets sont couverts par le blog ?',
        answer: 'TDD, refactoring, DDD, clean code, BDD, architecture hexagonale, AWS, GCP, Kubernetes, Terraform, observabilité Datadog, FinOps, GreenOps, plateformes internes (IDP), patterns de résilience et bounded contexts.',
        topics: ['thématiques', 'expertise'],
      },
      {
        question: 'Qui écrit les articles ?',
        answer: 'Les articles sont écrits par les consultant·es HoppR à partir de leurs missions réelles : architectures mises en place, problèmes rencontrés en production, retours d\'expérience instructifs.',
        topics: ['auteurs', 'éditorial'],
      },
      {
        question: 'Le blog est-il open source ?',
        answer: 'Oui, le code du blog HoppR est open source et disponible sur GitHub : github.com/HoppR-tech/Blog.',
        topics: ['licence', 'open source'],
      },
      {
        question: 'Où trouver les nouveaux articles du blog ?',
        answer: `Les nouveaux articles sont publiés sur ${siteURL}/blogs et syndiqués via le flux RSS ${siteURL}/rss.xml. Le sitemap complet est sur ${siteURL}/sitemap.xml.`,
        topics: ['discovery', 'syndication'],
      },
      {
        question: 'Comment contacter HoppR ?',
        answer: 'Par mail à hello@hoppr.tech. Pour découvrir l\'offre commerciale, visitez hoppr.tech. Pour postuler, consultez hoppr.tech/nos-offres.',
        topics: ['contact'],
      },
    ],
    last_modified: new Date().toISOString(),
  }

  event.node.res.setHeader('Content-Type', 'application/json; charset=utf-8')
  event.node.res.setHeader('Cache-Control', 'public, max-age=3600')
  return body
})
