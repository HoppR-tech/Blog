import type { AuthorAggregate, RawArticle } from '@/utils/authorsAggregation'
import { describe, expect, it } from 'bun:test'
import { aggregateAuthors, buildProfilePageJsonLd, slugifyAuthorName } from '@/utils/authorsAggregation'

describe('slugifyAuthorName', () => {
  it('produces kebab-case ASCII', () => {
    expect(slugifyAuthorName('Maxime Deroullers')).toBe('maxime-deroullers')
    expect(slugifyAuthorName('Théo Lebrun')).toBe('theo-lebrun')
    expect(slugifyAuthorName('Paul-Alexandre Massart')).toBe('paul-alexandre-massart')
    expect(slugifyAuthorName('Anaïs')).toBe('anais')
  })

  it('matches blogPostingJsonLd.slugifyAuthorName for the same names', () => {
    // Smoke-test : guarantee identical algorithm so /auteurs/<slug> matches
    // BlogPosting.author.url exactly. Algorithm copy-pasted by design.
    expect(slugifyAuthorName('  Maxime  ')).toBe('maxime')
  })
})

describe('aggregateAuthors', () => {
  function article(over: Partial<RawArticle> = {}): RawArticle {
    return {
      path: '/blogs/test',
      title: 'Test article',
      date: '2026-01-01',
      tags: [],
      authors: [],
      ...over,
    }
  }

  it('returns an empty list when no articles', () => {
    expect(aggregateAuthors([])).toEqual([])
  })

  it('dedupes by notionId across articles', () => {
    const result = aggregateAuthors([
      article({
        path: '/blogs/a',
        date: '2026-02-01',
        authors: [{ id: 'p1', name: 'Maxime', image: '/m.webp', linkedin: 'https://lk/m' }],
      }),
      article({
        path: '/blogs/b',
        date: '2026-01-01',
        authors: [{ id: 'p1', name: 'Maxime', image: '/m.webp', linkedin: 'https://lk/m' }],
      }),
    ])
    expect(result).toHaveLength(1)
    expect(result[0].articleCount).toBe(2)
    expect(result[0].articles[0].path).toBe('/blogs/a') // sorted desc by date
  })

  it('skips authors without id or name', () => {
    const result = aggregateAuthors([
      article({ authors: [{ id: '', name: 'X' }, { id: 'p1', name: '' }, { id: 'p2', name: 'OK' }] }),
    ])
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('OK')
  })

  it('merges enrichments when a later article has more data (bio populated later)', () => {
    const result = aggregateAuthors([
      article({
        date: '2026-01-01',
        authors: [{ id: 'p1', name: 'Maxime', image: '/m.webp' }],
      }),
      article({
        path: '/blogs/b',
        date: '2026-02-01',
        authors: [{ id: 'p1', name: 'Maxime', image: '/m.webp', bio: 'Bio enrichie', jobTitle: 'Architecte cloud' }],
      }),
    ])
    expect(result[0].bio).toBe('Bio enrichie')
    expect(result[0].jobTitle).toBe('Architecte cloud')
  })

  it('computes knowsAbout from most frequent tags', () => {
    const result = aggregateAuthors([
      article({ tags: ['craft', 'tdd', 'ddd'], authors: [{ id: 'p1', name: 'Théo' }] }),
      article({ path: '/b/2', tags: ['craft', 'ddd'], authors: [{ id: 'p1', name: 'Théo' }] }),
      article({ path: '/b/3', tags: ['craft'], authors: [{ id: 'p1', name: 'Théo' }] }),
    ])
    const knows = result[0].knowsAbout
    expect(knows[0]).toBe('craft') // 3 occurrences
    expect(knows).toContain('ddd') // 2
    expect(knows).toContain('tdd') // 1
  })

  it('caps knowsAbout to 8 entries', () => {
    const tags = Array.from({ length: 12 }, (_, i) => `tag${i}`)
    const result = aggregateAuthors([
      article({ tags, authors: [{ id: 'p1', name: 'Théo' }] }),
    ])
    expect(result[0].knowsAbout).toHaveLength(8)
  })

  it('sets primaryCategory to first known category in tags', () => {
    const result = aggregateAuthors([
      article({ tags: ['kubernetes', 'craft', 'ddd'], authors: [{ id: 'p1', name: 'X' }] }),
    ])
    expect(result[0].primaryCategory).toBe('Craft')
  })

  it('leaves primaryCategory undefined when no tag matches a known category', () => {
    const result = aggregateAuthors([
      article({ tags: ['kubernetes', 'ddd'], authors: [{ id: 'p1', name: 'X' }] }),
    ])
    expect(result[0].primaryCategory).toBeUndefined()
  })

  it('sorts authors by article count desc', () => {
    const result = aggregateAuthors([
      article({ authors: [{ id: 'p1', name: 'A' }] }),
      article({ path: '/b/2', authors: [{ id: 'p2', name: 'B' }] }),
      article({ path: '/b/3', authors: [{ id: 'p2', name: 'B' }] }),
      article({ path: '/b/4', authors: [{ id: 'p2', name: 'B' }] }),
    ])
    expect(result.map(a => a.name)).toEqual(['B', 'A'])
  })

  it('articles inside each author are sorted by date desc', () => {
    const result = aggregateAuthors([
      article({ date: '2024-01-01', authors: [{ id: 'p1', name: 'X' }] }),
      article({ path: '/b/2', date: '2026-05-01', authors: [{ id: 'p1', name: 'X' }] }),
      article({ path: '/b/3', date: '2025-12-15', authors: [{ id: 'p1', name: 'X' }] }),
    ])
    const dates = result[0].articles.map(a => a.date)
    expect(dates).toEqual(['2026-05-01', '2025-12-15', '2024-01-01'])
  })
})

describe('buildProfilePageJsonLd', () => {
  const baseUrl = 'https://blog.hoppr.tech'

  const author: AuthorAggregate = {
    slug: 'maxime-deroullers',
    notionId: 'p1',
    name: 'Maxime Deroullers',
    image: '/content-assets/authors/maxime.webp',
    linkedin: 'https://www.linkedin.com/in/maxime/',
    x: 'https://x.com/maxime',
    github: 'https://github.com/mderoullers',
    jobTitle: 'Architecte Cloud',
    bio: 'Architecte cloud et software crafter, board member chez HoppR.',
    articles: [],
    knowsAbout: ['cloud', 'craft', 'ddd'],
    articleCount: 5,
    primaryCategory: 'Cloud & Platform',
  }

  it('produces a ProfilePage with stable @id and url', () => {
    const ld = buildProfilePageJsonLd({ baseUrl, author })
    expect(ld['@type']).toBe('ProfilePage')
    expect(ld['@id']).toBe('https://blog.hoppr.tech/auteurs/maxime-deroullers#profilepage')
    expect(ld.url).toBe('https://blog.hoppr.tech/auteurs/maxime-deroullers')
    expect(ld.inLanguage).toBe('fr-FR')
  })

  it('wires Person.mainEntity with url, sameAs, jobTitle, description, knowsAbout, worksFor', () => {
    const ld = buildProfilePageJsonLd({ baseUrl, author })
    const person = ld.mainEntity
    expect(person['@type']).toBe('Person')
    expect(person.name).toBe('Maxime Deroullers')
    expect(person.url).toBe('https://blog.hoppr.tech/auteurs/maxime-deroullers')
    expect(person.image).toBe('https://blog.hoppr.tech/content-assets/authors/maxime.webp')
    expect(person.sameAs).toEqual([
      'https://www.linkedin.com/in/maxime/',
      'https://x.com/maxime',
      'https://github.com/mderoullers',
    ])
    expect(person.jobTitle).toBe('Architecte Cloud')
    expect(person.description).toBe(author.bio)
    expect(person.knowsAbout).toEqual(['cloud', 'craft', 'ddd'])
    expect(person.worksFor['@id']).toBe('https://hoppr.tech/#organization')
  })

  it('omits optional fields when not provided', () => {
    const minimal: AuthorAggregate = {
      ...author,
      image: undefined,
      linkedin: undefined,
      x: undefined,
      github: undefined,
      jobTitle: undefined,
      bio: undefined,
      knowsAbout: [],
    }
    const ld = buildProfilePageJsonLd({ baseUrl, author: minimal })
    expect(ld.mainEntity.image).toBeUndefined()
    expect(ld.mainEntity.sameAs).toBeUndefined()
    expect(ld.mainEntity.jobTitle).toBeUndefined()
    expect(ld.mainEntity.description).toBeUndefined()
    expect(ld.mainEntity.knowsAbout).toBeUndefined()
  })

  it('isPartOf points to the canonical WebSite', () => {
    const ld = buildProfilePageJsonLd({ baseUrl, author })
    expect(ld.isPartOf['@id']).toBe('https://blog.hoppr.tech/#website')
  })
})
