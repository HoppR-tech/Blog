import type { Person } from '@/types/blog'
import { describe, expect, it } from 'bun:test'
import {
  buildBlogPostingJsonLd,
  buildPersonEntry,
  estimateWordCount,
  findPrimaryCategoryLabel,
  slugifyAuthorName,
} from '@/utils/blogPostingJsonLd'

const baseUrl = 'https://blog.hoppr.tech'

const maxime: Person = {
  notionId: 'n-1',
  name: 'Maxime Deroullers',
  image: '/content-assets/authors/maxime.webp',
  linkedin: 'https://www.linkedin.com/in/maxime-deroullers/',
  x: 'https://x.com/mderoullers',
}

const theo: Person = {
  notionId: 'n-2',
  name: 'Théo Lebrun',
  image: '',
  linkedin: undefined,
  x: undefined,
}

describe('slugifyAuthorName', () => {
  it('produces a kebab-case ASCII slug', () => {
    expect(slugifyAuthorName('Maxime Deroullers')).toBe('maxime-deroullers')
    expect(slugifyAuthorName('Théo Lebrun')).toBe('theo-lebrun')
    expect(slugifyAuthorName('Paul-Alexandre Massart')).toBe('paul-alexandre-massart')
  })

  it('trims edge dashes when input has surrounding whitespace or punctuation', () => {
    expect(slugifyAuthorName('  Anaïs  ')).toBe('anais')
    expect(slugifyAuthorName('!@#Sam!@#')).toBe('sam')
  })
})

describe('estimateWordCount', () => {
  it('returns undefined when no body is provided', () => {
    expect(estimateWordCount(undefined)).toBeUndefined()
    expect(estimateWordCount('')).toBeUndefined()
  })

  it('counts words excluding markdown code fences', () => {
    // "This is a sentence" (4) + "Another line here" (3) = 7
    const body = 'This is a sentence.\n\n```ts\nconst hidden = 42\n```\n\nAnother line here.'
    const count = estimateWordCount(body)
    expect(count).toBe(7)
  })

  it('counts words excluding inline code', () => {
    // "Use" (1) + "to install the package" (4) = 5
    const body = 'Use `npm install` to install the package'
    const count = estimateWordCount(body)
    expect(count).toBe(5)
  })
})

describe('findPrimaryCategoryLabel', () => {
  it('returns the first tag matching a known category', () => {
    expect(findPrimaryCategoryLabel(['kubernetes', 'craft', 'ddd'])).toBe('Craft')
    expect(findPrimaryCategoryLabel(['cloud-platform'])).toBe('Cloud & Platform')
  })

  it('returns undefined when no tag matches a category', () => {
    expect(findPrimaryCategoryLabel(['kubernetes', 'ddd'])).toBeUndefined()
    expect(findPrimaryCategoryLabel([])).toBeUndefined()
  })
})

describe('buildPersonEntry', () => {
  it('builds an enriched Person with url, image, sameAs when fields are populated', () => {
    const entry = buildPersonEntry(baseUrl, maxime)

    expect(entry['@type']).toBe('Person')
    expect(entry.name).toBe('Maxime Deroullers')
    expect(entry.url).toBe('https://blog.hoppr.tech/auteurs/maxime-deroullers')
    expect(entry.image).toBe('https://blog.hoppr.tech/content-assets/authors/maxime.webp')
    expect(entry.sameAs).toEqual([
      'https://www.linkedin.com/in/maxime-deroullers/',
      'https://x.com/mderoullers',
    ])
  })

  it('omits image and sameAs when not provided (no empty strings, no undefined keys)', () => {
    const entry = buildPersonEntry(baseUrl, theo)

    expect(entry.name).toBe('Théo Lebrun')
    expect(entry.url).toBe('https://blog.hoppr.tech/auteurs/theo-lebrun')
    expect(entry.image).toBeUndefined()
    expect(entry.sameAs).toBeUndefined()
  })

  it('keeps absolute image URLs unchanged', () => {
    const withAbsoluteImage: Person = { ...maxime, image: 'https://other.cdn/avatar.png' }
    const entry = buildPersonEntry(baseUrl, withAbsoluteImage)
    expect(entry.image).toBe('https://other.cdn/avatar.png')
  })
})

describe('buildBlogPostingJsonLd', () => {
  const base = {
    baseUrl,
    path: '/blogs/2026-05-04-mainframe-aws',
    title: 'Mainframe & AWS',
    description: 'Réconcilier deux mondes grâce à l\'Event-Driven.',
    image: '/content-assets/.../cover.webp',
    datePublished: '2026-05-04',
    tags: ['architecture', 'cloud-platform'],
    authors: [maxime],
  }

  it('produces a schema.org BlogPosting with required fields', () => {
    const ld = buildBlogPostingJsonLd(base)

    expect(ld['@context']).toBe('https://schema.org')
    expect(ld['@type']).toBe('BlogPosting')
    expect(ld.headline).toBe('Mainframe & AWS')
    expect(ld.description).toBe('Réconcilier deux mondes grâce à l\'Event-Driven.')
    expect(ld.datePublished).toBe('2026-05-04')
    expect(ld.inLanguage).toBe('fr-FR')
  })

  it('exposes image as an ImageObject with absolute URL', () => {
    const ld = buildBlogPostingJsonLd(base)
    expect(ld.image['@type']).toBe('ImageObject')
    expect(ld.image.url).toBe('https://blog.hoppr.tech/content-assets/.../cover.webp')
  })

  it('falls back dateModified to datePublished when not provided', () => {
    const ld = buildBlogPostingJsonLd(base)
    expect(ld.dateModified).toBe('2026-05-04')
  })

  it('keeps dateModified distinct from datePublished when provided', () => {
    const ld = buildBlogPostingJsonLd({ ...base, dateModified: '2026-05-11' })
    expect(ld.datePublished).toBe('2026-05-04')
    expect(ld.dateModified).toBe('2026-05-11')
  })

  it('builds enriched authors with deep-link URLs to /auteurs/<slug>', () => {
    const ld = buildBlogPostingJsonLd(base)
    expect(ld.author).toHaveLength(1)
    expect(ld.author[0]!.name).toBe('Maxime Deroullers')
    expect(ld.author[0]!.url).toBe('https://blog.hoppr.tech/auteurs/maxime-deroullers')
    expect(ld.author[0]!.sameAs).toEqual([
      'https://www.linkedin.com/in/maxime-deroullers/',
      'https://x.com/mderoullers',
    ])
  })

  it('references the canonical HoppR Organization via @id in publisher', () => {
    const ld = buildBlogPostingJsonLd(base)
    expect(ld.publisher['@id']).toBe('https://hoppr.tech/#organization')
    expect(ld.publisher.name).toBe('HoppR')
    expect(ld.publisher.logo['@type']).toBe('ImageObject')
  })

  it('sets articleSection from the first tag matching a known category', () => {
    const ld = buildBlogPostingJsonLd(base)
    expect(ld.articleSection).toBe('Architecture')
  })

  it('omits articleSection when no tag matches a known category', () => {
    const ld = buildBlogPostingJsonLd({ ...base, tags: ['kubernetes', 'ddd'] })
    expect(ld.articleSection).toBeUndefined()
  })

  it('emits keywords joined by comma when tags are present', () => {
    const ld = buildBlogPostingJsonLd(base)
    expect(ld.keywords).toBe('architecture, cloud-platform')
  })

  it('emits wordCount only when rawBody yields a positive count', () => {
    const ldWithoutBody = buildBlogPostingJsonLd(base)
    expect(ldWithoutBody.wordCount).toBeUndefined()

    const ldWithBody = buildBlogPostingJsonLd({
      ...base,
      rawBody: 'one two three four five six seven eight nine ten',
    })
    expect(ldWithBody.wordCount).toBe(10)
  })

  it('builds mainEntityOfPage from the canonical base + path', () => {
    const ld = buildBlogPostingJsonLd(base)
    expect(ld.mainEntityOfPage['@id']).toBe('https://blog.hoppr.tech/blogs/2026-05-04-mainframe-aws')
  })

  it('strips a trailing slash from the base URL', () => {
    const ld = buildBlogPostingJsonLd({ ...base, baseUrl: 'https://blog.hoppr.tech/' })
    expect(ld.mainEntityOfPage['@id']).toBe('https://blog.hoppr.tech/blogs/2026-05-04-mainframe-aws')
  })
})
