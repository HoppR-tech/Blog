const POSITIVE_INTEGER = /^[1-9]\d*$/

/**
 * Resolve a route query value to a valid page within the available range.
 *
 * Page 1 remains valid for an empty result set so search pages can render an
 * explicit "no result" state. Every malformed, repeated, fractional, zero,
 * negative, or out-of-range value is rejected.
 */
export function resolvePageNumber(value: unknown, totalPages: number): number | null {
  if (value === undefined) {
    return 1
  }

  if (typeof value !== 'string' || !POSITIVE_INTEGER.test(value)) {
    return null
  }

  const page = Number(value)
  const lastPage = Math.max(1, totalPages)

  if (!Number.isSafeInteger(page) || page > lastPage) {
    return null
  }

  return page
}

export function buildPaginationUrl(
  baseUrl: string,
  page: number,
  query: Record<string, string> = {},
): string {
  const params = new URLSearchParams(query)

  if (page > 1) {
    params.set('page', String(page))
  }
  else {
    params.delete('page')
  }

  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

export function buildPaginationHeadLinks(
  baseUrl: string,
  currentPage: number,
  totalPages: number,
): Array<{ rel: 'prev' | 'next', href: string }> {
  const links: Array<{ rel: 'prev' | 'next', href: string }> = []

  if (currentPage > 1) {
    links.push({
      rel: 'prev',
      href: buildPaginationUrl(baseUrl, currentPage - 1),
    })
  }

  if (currentPage < totalPages) {
    links.push({
      rel: 'next',
      href: buildPaginationUrl(baseUrl, currentPage + 1),
    })
  }

  return links
}
