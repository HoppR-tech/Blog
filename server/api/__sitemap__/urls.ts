import { defineSitemapEventHandler } from '#imports'
import { categories } from '@/utils/categories'

const MIN_ARTICLES_FOR_TAG_INDEX = 3

export default defineSitemapEventHandler(async (event) => {
  const articles = await queryCollection(event, 'blogs').order('date', 'DESC').all()

  const articleUrls = articles.map(article => ({
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
    const categoryArticles = articles.filter(a =>
      a.tags?.map(t => t.toLowerCase()).includes(cat.value.toLowerCase()),
    )
    const latestDate = categoryArticles.length > 0 ? categoryArticles[0].date : undefined
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
  ]

  return [...staticUrls, ...articleUrls, ...categoryUrls, ...tagUrls]
})
