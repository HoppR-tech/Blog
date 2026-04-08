import { useAbsoluteUrl } from './useAbsoluteUrl'

interface SeoMetaOptions {
  title: string
  description: string
  url: string
  image?: string
  type?: string
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  noindex?: boolean
}

/**
 * Centralized SEO meta composable. Sets OG, Twitter, canonical, and optional JSON-LD.
 * Ensures absolute URLs, consistent og:site_name, og:locale, and no og:image conflicts.
 */
export function usePageSeo(options: SeoMetaOptions): void {
  const {
    title,
    description,
    url,
    image,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
    jsonLd,
    noindex,
  } = options

  const absoluteUrl = useAbsoluteUrl(url)
  const absoluteImage = image ? useAbsoluteUrl(image) : undefined

  const meta: Array<{ name?: string, property?: string, content: string }> = [
    { name: 'description', content: description },
    { property: 'og:site_name', content: 'Blog HoppR' },
    { property: 'og:locale', content: 'fr_FR' },
    { property: 'og:type', content: type },
    { property: 'og:url', content: absoluteUrl },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { name: 'twitter:site', content: '@HoppR_Tech' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: absoluteUrl },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ]

  if (absoluteImage) {
    meta.push({ property: 'og:image', content: absoluteImage })
    meta.push({ name: 'twitter:image', content: absoluteImage })
  }

  if (publishedTime) {
    meta.push({ property: 'article:published_time', content: publishedTime })
  }

  if (modifiedTime) {
    meta.push({ property: 'article:modified_time', content: modifiedTime })
  }

  if (authors && authors.length > 0) {
    for (const author of authors) {
      meta.push({ property: 'article:author', content: author })
    }
  }

  if (noindex) {
    meta.push({ name: 'robots', content: 'noindex, follow' })
  }

  const link: Array<{ rel: string, href: string }> = [
    { rel: 'canonical', href: absoluteUrl },
  ]

  const script: Array<{ type: string, innerHTML: string }> = []

  if (jsonLd) {
    script.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd),
    })
  }

  useHead({
    title,
    meta,
    link,
    script,
  })
}
