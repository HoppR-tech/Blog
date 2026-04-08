import { describe, expect, it } from 'bun:test'

/**
 * Pagination logic tests.
 * We test the pure logic for page range generation and prev/next link computation.
 */

function computePageRange(currentPage: number, totalPages: number, maxVisible: number = 7): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, currentPage - half)
  const end = Math.min(totalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

function computePrevNext(currentPage: number, totalPages: number, baseUrl: string): { prev?: string, next?: string } {
  const result: { prev?: string, next?: string } = {}

  if (currentPage > 1) {
    result.prev = currentPage === 2 ? baseUrl : `${baseUrl}?page=${currentPage - 1}`
  }

  if (currentPage < totalPages) {
    result.next = `${baseUrl}?page=${currentPage + 1}`
  }

  return result
}

describe('pagination SSR - page range (TASK-023)', () => {
  it('should show all pages when total <= maxVisible', () => {
    expect(computePageRange(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('should center current page in range', () => {
    const range = computePageRange(4, 10)
    expect(range).toContain(4)
    expect(range.length).toBe(7)
  })

  it('should not go below 1', () => {
    const range = computePageRange(1, 10)
    expect(range[0]).toBe(1)
  })

  it('should not exceed total pages', () => {
    const range = computePageRange(10, 10)
    expect(range[range.length - 1]).toBe(10)
  })
})

describe('pagination SSR - prev/next links (TASK-023)', () => {
  it('should have no prev on page 1', () => {
    const { prev, next } = computePrevNext(1, 6, '/blogs')
    expect(prev).toBeUndefined()
    expect(next).toBe('/blogs?page=2')
  })

  it('should have prev and next on middle page', () => {
    const { prev, next } = computePrevNext(3, 6, '/blogs')
    expect(prev).toBe('/blogs?page=2')
    expect(next).toBe('/blogs?page=4')
  })

  it('should have no next on last page', () => {
    const { prev, next } = computePrevNext(6, 6, '/blogs')
    expect(prev).toBe('/blogs?page=5')
    expect(next).toBeUndefined()
  })

  it('should link to base URL (no query) for prev on page 2', () => {
    const { prev } = computePrevNext(2, 6, '/blogs')
    expect(prev).toBe('/blogs')
  })
})
