import type { MaybeRefOrGetter } from 'vue'
import type { JsonLdNode } from '@/utils/organization'
import { toValue } from 'vue'
import { useAbsoluteUrl } from './useAbsoluteUrl'

const TRAILING_SLASH = /\/$/

interface SeoMetaOptions {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  url: MaybeRefOrGetter<string>
  image?: MaybeRefOrGetter<string | undefined>
  type?: MaybeRefOrGetter<string | undefined>
  publishedTime?: MaybeRefOrGetter<string | undefined>
  modifiedTime?: MaybeRefOrGetter<string | undefined>
  authors?: MaybeRefOrGetter<string[] | undefined>
  jsonLd?: MaybeRefOrGetter<JsonLdNode | JsonLdNode[] | undefined>
  noindex?: MaybeRefOrGetter<boolean | undefined>
}

function resolveAbsoluteUrl(path: string, baseUrl: string): string {
  if (path.startsWith('http://') || path.startsWith('https://'))
    return path

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}

/**
 * Centralized SEO meta composable. Sets OG, Twitter, canonical, and optional JSON-LD.
 * Ensures absolute URLs, consistent og:site_name, og:locale, and no og:image conflicts.
 */
export function usePageSeo(options: SeoMetaOptions): void {
  // Resolve Nuxt runtime state while the composable is executing. The reactive
  // head factory can also run later during Nitro prerendering, outside an active
  // Nuxt instance, so it must only use plain values and reactive inputs.
  const baseUrl = useAbsoluteUrl('/').replace(TRAILING_SLASH, '')

  useHead(() => {
    const title = toValue(options.title)
    const description = toValue(options.description)
    const absoluteUrl = resolveAbsoluteUrl(toValue(options.url), baseUrl)
    const image = toValue(options.image)
    const absoluteImage = image ? resolveAbsoluteUrl(image, baseUrl) : undefined
    const type = toValue(options.type) || 'website'
    const publishedTime = toValue(options.publishedTime)
    const modifiedTime = toValue(options.modifiedTime)
    const authors = toValue(options.authors)
    const jsonLd = toValue(options.jsonLd)
    const noindex = toValue(options.noindex)

    const meta: Array<{ name?: string, property?: string, content: string }> = [
      { name: 'description', content: description },
      { property: 'og:site_name', content: 'Blog HoppR' },
      { property: 'og:locale', content: 'fr_FR' },
      { property: 'og:type', content: type },
      { property: 'og:url', content: absoluteUrl },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
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

    return {
      title,
      meta,
      link,
      script,
    }
  })
}
