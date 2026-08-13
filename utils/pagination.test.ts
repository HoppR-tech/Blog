import { describe, expect, it } from 'bun:test'
import {
  buildPaginationHeadLinks,
  buildPaginationUrl,
  resolvePageNumber,
} from './pagination'

describe('resolvePageNumber', () => {
  it('defaults to page 1 when the query parameter is absent', () => {
    expect(resolvePageNumber(undefined, 4)).toBe(1)
  })

  it('accepts a positive integer within range', () => {
    expect(resolvePageNumber('3', 4)).toBe(3)
  })

  it.each(['', '0', '-1', '1.5', '01', 'NaN'])('rejects malformed page %s', (page) => {
    expect(resolvePageNumber(page, 4)).toBeNull()
  })

  it('rejects repeated and out-of-range page parameters', () => {
    expect(resolvePageNumber(['2', '3'], 4)).toBeNull()
    expect(resolvePageNumber('5', 4)).toBeNull()
  })

  it('allows page 1 for an empty result set', () => {
    expect(resolvePageNumber(undefined, 0)).toBe(1)
    expect(resolvePageNumber('1', 0)).toBe(1)
  })
})

describe('pagination URLs', () => {
  it('keeps page 1 query-free and preserves additional query parameters', () => {
    expect(buildPaginationUrl('/blogs', 1)).toBe('/blogs')
    expect(buildPaginationUrl('/blogs', 1, { search: 'clean architecture' }))
      .toBe('/blogs?search=clean+architecture')
  })

  it('builds consistent previous and next head links', () => {
    expect(buildPaginationHeadLinks('/blogs', 2, 4)).toEqual([
      { rel: 'prev', href: '/blogs' },
      { rel: 'next', href: '/blogs?page=3' },
    ])
  })
})
