import type { H3Event } from 'h3'
import type { RawArticle } from '@/utils/authorsAggregation'
import { aggregateAuthors } from '@/utils/authorsAggregation'
import { categories } from '@/utils/categories'
import { isSitemapArticle } from '@/utils/sitemapFilters'

// Server-side queryCollection has signature (event, collection) but auto-import types only expose client-side (collection)
// @ts-expect-error - Nuxt Content v3 server auto-import provides 2-arg overload at runtime
const serverQueryCollection: (event: H3Event, collection: 'blogs') => ReturnType<typeof queryCollection> = queryCollection

const MIN_ARTICLES_FOR_TAG_INDEX = 3

interface SitemapArticle {
  path: string
  date?: string
  published?: boolean
  tags?: string[]
  authors?: Array<{ id?: string, name?: string }>
}

export default defineEventHandler(async (event) => {
  const allArticles: SitemapArticle[] = await serverQueryCollection(event, 'blogs').order('date', 'DESC').all()

  // Only advertise real, published article pages (see isSitemapArticle): drafts
  // and malformed entries would render the catch-all 404 page for crawlers.
  const articles: SitemapArticle[] = allArticles.filter(isSitemapArticle)

  const articleUrls = articles.map((article: SitemapArticle) => ({
    loc: article.path,
    lastmod: article.date || undefined,
  }))

  // Build tag counts
  const tagInfo: Record<string, { count: number, latestDate: string }> = {}
  for (const article of articles) {
    for (const tag of article.tags || []) {
      const normalizedTag = tag.toLowerCase()
      if (!tagInfo[normalizedTag]) {
        tagInfo[normalizedTag] = { count: 0, latestDate: article.date || '' }
      }
      tagInfo[normalizedTag].count++
      if (article.date && article.date > tagInfo[normalizedTag].latestDate) {
        tagInfo[normalizedTag].latestDate = article.date
      }
    }
  }

  // Only include tags with enough articles
  const tagUrls = Object.entries(tagInfo)
    .filter(([_, info]) => info.count >= MIN_ARTICLES_FOR_TAG_INDEX)
    .map(([tag, info]) => ({
      loc: `/tags/${tag}`,
      lastmod: info.latestDate || undefined,
    }))

  // Category pages with lastmod = latest article date in that category
  const categoryUrls = categories.map((cat) => {
    const categoryArticles = articles.filter((a: SitemapArticle) =>
      a.tags?.map((t: string) => t.toLowerCase()).includes(cat.value.toLowerCase()),
    )
    const latestDate = categoryArticles.length > 0 ? categoryArticles[0]?.date : undefined
    return {
      loc: `/categories/${cat.value}`,
      lastmod: latestDate || undefined,
    }
  })

  // Static pages
  const staticUrls = [
    { loc: '/', lastmod: articles[0]?.date || undefined },
    { loc: '/blogs', lastmod: articles[0]?.date || undefined },
    { loc: '/tags', lastmod: articles[0]?.date || undefined },
    { loc: '/categories', lastmod: articles[0]?.date || undefined },
    { loc: '/auteurs', lastmod: articles[0]?.date || undefined },
    { loc: '/a-propos', lastmod: articles[0]?.date || undefined },
  ]

  // Author profile pages aggregated from articles
  const authors = aggregateAuthors(articles as unknown as RawArticle[])
  const authorUrls = authors.map(author => ({
    loc: `/auteurs/${author.slug}`,
    lastmod: author.articles[0]?.date || undefined,
  }))

  return [...staticUrls, ...articleUrls, ...categoryUrls, ...tagUrls, ...authorUrls]
})
