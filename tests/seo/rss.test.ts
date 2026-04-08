import { describe, expect, it } from 'bun:test'
import { resolveContentAsset } from '@/utils/contentAssets'

describe('rSS feed - content asset URLs (TASK-017/TASK-019)', () => {
  it('should produce absolute enclosure URL by prefixing baseUrl', () => {
    // Given: an article with an image
    const baseUrl = 'https://blog.hoppr.tech'
    const relativePath = resolveContentAsset('./assets/cover.webp', '/blogs/2024-01-01-my-article')

    // When: we prefix with baseUrl for RSS enclosure
    const absoluteUrl = `${baseUrl}${relativePath}`

    // Then: the URL is absolute
    expect(absoluteUrl).toMatch(/^https:\/\//)
    expect(absoluteUrl).toBe('https://blog.hoppr.tech/content-assets/2024-01-01-my-article/assets/cover.webp')
  })

  it('should handle null authors gracefully with optional chaining', () => {
    // Given: an article with null authors
    const authors: { name: string }[] | null = null

    // When: we safely access authors with optional chaining
    const authorStr = authors?.map(a => a.name).join(', ') || ''

    // Then: no crash, returns empty string
    expect(authorStr).toBe('')
  })

  it('should handle undefined authors gracefully', () => {
    const authors: { name: string }[] | undefined = undefined
    const authorStr = authors?.map(a => a.name).join(', ') || ''
    expect(authorStr).toBe('')
  })

  it('should join multiple authors with commas', () => {
    const authors = [{ name: 'Alice' }, { name: 'Bob' }]
    const authorStr = authors?.map(a => a.name).join(', ') || ''
    expect(authorStr).toBe('Alice, Bob')
  })

  it('should produce valid RSS item fields for an article', () => {
    // Given: an article with all fields
    const baseUrl = 'https://blog.hoppr.tech'
    const post = {
      title: 'Mon Article',
      description: 'Description de test',
      path: '/blogs/2024-01-01-my-article',
      date: '2024-06-10',
      authors: [{ name: 'Alice' }],
      tags: ['craft', 'testing'],
      image: './assets/cover.webp',
    }

    // When: we generate RSS item fields
    const url = `${baseUrl}${post.path}`
    const authorStr = post.authors?.map(a => a.name).join(', ') || ''
    const imageUrl = `${baseUrl}${resolveContentAsset(post.image, post.path)}`

    // Then: all fields are present and correct
    expect(url).toBe('https://blog.hoppr.tech/blogs/2024-01-01-my-article')
    expect(authorStr).toBe('Alice')
    expect(imageUrl).toMatch(/^https:\/\//)
    expect(post.title).toBeTruthy()
    expect(post.description).toBeTruthy()
    expect(post.date).toBeTruthy()
  })
})
