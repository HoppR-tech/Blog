import { describe, expect, it, mock } from 'bun:test'

const mockUseRuntimeConfig = mock(() => ({
  public: { baseUrl: 'https://blog.hoppr.tech' },
}))

;(globalThis as any).useRuntimeConfig = mockUseRuntimeConfig

const { useAbsoluteUrl } = await import('./useAbsoluteUrl')

describe('useAbsoluteUrl', () => {
  it('should prefix a relative path with baseUrl', () => {
    expect(useAbsoluteUrl('/content-assets/slug/assets/cover.webp'))
      .toBe('https://blog.hoppr.tech/content-assets/slug/assets/cover.webp')
  })

  it('should not double-prefix an already absolute URL', () => {
    expect(useAbsoluteUrl('https://example.com/image.png'))
      .toBe('https://example.com/image.png')
  })

  it('should handle http URLs as already absolute', () => {
    expect(useAbsoluteUrl('http://localhost:3000/image.png'))
      .toBe('http://localhost:3000/image.png')
  })

  it('should return empty string for empty input', () => {
    expect(useAbsoluteUrl('')).toBe('')
  })

  it('should handle path without leading slash', () => {
    expect(useAbsoluteUrl('content-assets/slug/assets/cover.webp'))
      .toBe('https://blog.hoppr.tech/content-assets/slug/assets/cover.webp')
  })

  it('should not produce double slashes when baseUrl has trailing slash', () => {
    mockUseRuntimeConfig.mockReturnValueOnce({
      public: { baseUrl: 'https://blog.hoppr.tech/' },
    })
    expect(useAbsoluteUrl('/images/test.png'))
      .toBe('https://blog.hoppr.tech/images/test.png')
  })
})
