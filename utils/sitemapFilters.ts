export interface PublishableArticle {
  path?: string
  published?: boolean
}

/**
 * Only published articles backed by a real `/blogs/` slug belong in the sitemap.
 *
 * Drafts (`published !== true`) and malformed entries — e.g. a Notion post synced
 * with its raw ID as path instead of a `/blogs/...` slug — render the catch-all
 * 404 page. Advertising them to crawlers produces soft-404s and triggers the
 * 404 OG image render, so they must be filtered out at the source.
 */
export function isSitemapArticle(article: PublishableArticle): boolean {
  return article.published === true
    && typeof article.path === 'string'
    && article.path.startsWith('/blogs/')
}
