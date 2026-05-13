/**
 * llms.txt — standard llmstxt.org for LLM-friendly site description.
 *
 * Kept static to avoid coupling LLM discovery with Nuxt Content queries:
 * - the section descriptor is what LLMs actually need (intent + entry points)
 * - the exhaustive article index is already exposed via /sitemap.xml and /rss.xml
 *   (both referenced below), so duplicating it here adds no signal.
 */

const TRAILING_SLASH = /\/$/

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteURL = (config.public.baseUrl as string).replace(TRAILING_SLASH, '')

  const body = `# Blog HoppR

> Blog tech francophone de HoppR (ESN Lyon, Software Craftsmanship & Cloud).
> Articles longs (1500-3000 mots) sur l'architecture, le DDD, le craft, le cloud, la data, l'observabilité et l'IA appliquée.
> Publié en français. Auteurs : équipe tech HoppR.

## Sections principales

- [Tous les articles](${siteURL}/blogs): index chronologique complet
- [Software Craftsmanship](${siteURL}/categories/craft): TDD, refactoring, DDD, clean code, BDD
- [Cloud & Platform](${siteURL}/categories/cloud-platform): AWS, GCP, Kubernetes, IaC, plateformes internes
- [Architecture](${siteURL}/categories/architecture): patterns, événementiel, microservices, hexagonal, DDD
- [Autres & Événements](${siteURL}/categories/others): conférences, REX communauté, formations

## Ressources techniques

- [Flux RSS](${siteURL}/rss.xml): syndication standard, tous les articles
- [Sitemap XML](${siteURL}/sitemap.xml): index des URLs indexables (articles, catégories, tags)

## Crédit

- Organisation : HoppR — https://hoppr.tech
- Code source du blog : https://github.com/HoppR-tech/Blog
- Contact : hello@hoppr.tech
`

  event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  event.node.res.setHeader('Cache-Control', 'public, max-age=3600')
  return body
})
