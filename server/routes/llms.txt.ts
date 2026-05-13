import type { H3Event } from 'h3'

// Server-side queryCollection has signature (event, collection) but auto-import types only expose client-side (collection)
// @ts-expect-error - Nuxt Content v3 server auto-import provides 2-arg overload at runtime
const serverQueryCollection: (event: H3Event, collection: 'blogs') => ReturnType<typeof queryCollection> = queryCollection

const MAX_FEATURED_ARTICLES = 10
const MAX_DESCRIPTION_LENGTH = 140

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength)
    return text
  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteURL = config.public.baseUrl as string

  try {
    const allPosts = await serverQueryCollection(event, 'blogs')
      .order('date', 'DESC')
      .all()

    const featured = allPosts.slice(0, MAX_FEATURED_ARTICLES)

    const featuredLines = featured
      .map((post) => {
        const url = `${siteURL}${post.path}`
        const desc = truncate((post.description as string) || '', MAX_DESCRIPTION_LENGTH)
        return `- [${post.title}](${url}): ${desc}`
      })
      .join('\n')

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

- [Flux RSS](${siteURL}/rss.xml): syndication standard
- [Sitemap](${siteURL}/sitemap.xml): index des URLs indexables

## Articles récents (${featured.length}/${allPosts.length} publiés)

${featuredLines}
`

    event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    event.node.res.setHeader('Cache-Control', 'public, max-age=3600')
    return body
  }
  catch (err) {
    console.error('llms.txt generation failed:', err)
    event.node.res.statusCode = 500
    event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    return '# Blog HoppR\n\nError generating llms.txt\n'
  }
})
