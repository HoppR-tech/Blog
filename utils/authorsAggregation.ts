/**
 * Aggregate author·rice·s across all published articles into a single index.
 *
 * Each article exposes `authors[]` from the Notion sync (Persons Blog →
 * Posts via Notion relation). This module dedupes by notionId, computes
 * stable kebab-case slugs (cohérent avec utils/blogPostingJsonLd.ts
 * slugifyAuthorName), aggregates expertise hints from tags, and returns
 * a structure consumable by the /auteurs/* pages and ProfilePage JSON-LD.
 *
 * Pure functions — no Nuxt or runtime dependency. The Vue pages call
 * aggregateAuthors() with the result of queryCollection('blogs').all().
 */

import type { Person } from '@/types/blog'
import { categories } from '@/utils/categories'

export interface ArticleSummary {
  path: string
  title: string
  date: string
  image?: string
  description?: string
  tags?: string[]
}

export interface RawArticleAuthor extends Partial<Person> {
  id?: string
  name?: string
  image?: string
  linkedin?: string
  x?: string
  github?: string
  jobTitle?: string
  bio?: string
}

export interface RawArticle {
  path?: string
  title?: string
  date?: string
  image?: string
  description?: string
  tags?: string[]
  authors?: RawArticleAuthor[]
}

export interface AuthorAggregate {
  slug: string
  notionId: string
  name: string
  image?: string
  linkedin?: string
  x?: string
  github?: string
  jobTitle?: string
  bio?: string
  articles: ArticleSummary[]
  knowsAbout: string[]
  articleCount: number
  primaryCategory?: string
}

const AUTHOR_SLUG_NON_ALPHANUM = /[^a-z0-9]+/g
const AUTHOR_SLUG_EDGES = /^-+|-+$/g
const COMBINING_DIACRITICS = /\p{M}/gu
const MAX_ARTICLES_PER_AUTHOR = 100
const MAX_KNOWS_ABOUT = 8

/**
 * Stable kebab-case ASCII slug. Mirrored from blogPostingJsonLd.slugifyAuthorName
 * so /auteurs/<slug> matches BlogPosting.author.url exactly.
 */
export function slugifyAuthorName(name: string): string {
  return name
    .normalize('NFD')
    .replace(COMBINING_DIACRITICS, '')
    .toLowerCase()
    .replace(AUTHOR_SLUG_NON_ALPHANUM, '-')
    .replace(AUTHOR_SLUG_EDGES, '')
}

/**
 * Build a deduped index of authors with all their articles + computed
 * knowsAbout (tags les plus fréquents) + primary category.
 *
 * Articles passed to this function should already be filtered to published
 * ones (the collection query handles that upstream).
 */
export function aggregateAuthors(articles: RawArticle[]): AuthorAggregate[] {
  // Map keyed by notionId (stable across name changes).
  const byId = new Map<string, AuthorAggregate>()
  const tagCountByAuthor = new Map<string, Map<string, number>>()

  for (const article of articles) {
    if (!article.authors || article.authors.length === 0)
      continue
    const summary: ArticleSummary = {
      path: article.path ?? '',
      title: article.title ?? '',
      date: article.date ?? '',
      image: article.image,
      description: article.description,
      tags: article.tags,
    }

    for (const author of article.authors) {
      const id = author.id ?? author.notionId
      const name = author.name
      if (!id || !name)
        continue

      let agg = byId.get(id)
      if (!agg) {
        agg = {
          slug: slugifyAuthorName(name),
          notionId: id,
          name,
          image: author.image,
          linkedin: author.linkedin,
          x: author.x,
          github: author.github,
          jobTitle: author.jobTitle,
          bio: author.bio,
          articles: [],
          knowsAbout: [],
          articleCount: 0,
        }
        byId.set(id, agg)
        tagCountByAuthor.set(id, new Map())
      }
      else {
        // Merge fields if later articles enrich them (bio populated later).
        if (!agg.image && author.image)
          agg.image = author.image
        if (!agg.linkedin && author.linkedin)
          agg.linkedin = author.linkedin
        if (!agg.x && author.x)
          agg.x = author.x
        if (!agg.github && author.github)
          agg.github = author.github
        if (!agg.jobTitle && author.jobTitle)
          agg.jobTitle = author.jobTitle
        if (!agg.bio && author.bio)
          agg.bio = author.bio
      }

      agg.articles.push(summary)
      agg.articleCount++

      const tagCounts = tagCountByAuthor.get(id)!
      for (const tag of article.tags ?? []) {
        const normalized = tag.toLowerCase()
        tagCounts.set(normalized, (tagCounts.get(normalized) ?? 0) + 1)
      }
    }
  }

  // Sort articles desc by date, compute knowsAbout and primaryCategory.
  for (const [id, agg] of byId) {
    agg.articles.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    if (agg.articles.length > MAX_ARTICLES_PER_AUTHOR)
      agg.articles = agg.articles.slice(0, MAX_ARTICLES_PER_AUTHOR)

    const tagCounts = tagCountByAuthor.get(id)!
    const sortedTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1])

    agg.knowsAbout = sortedTags
      .slice(0, MAX_KNOWS_ABOUT)
      .map(([tag]) => tag)

    // Primary category = first tag matching a known category.
    const knownValues = new Set(categories.map(c => c.value.toLowerCase()))
    for (const [tag] of sortedTags) {
      if (knownValues.has(tag)) {
        const cat = categories.find(c => c.value.toLowerCase() === tag)
        if (cat) {
          agg.primaryCategory = cat.label
          break
        }
      }
    }
  }

  return [...byId.values()].sort((a, b) => b.articleCount - a.articleCount)
}

/**
 * Build a ProfilePage JSON-LD entity for an author page.
 * The Person inside `mainEntity` mirrors the lightweight Person used in
 * BlogPosting.author[] but adds bio / jobTitle / knowsAbout / worksFor.
 */
export interface ProfilePageJsonLd {
  '@context': 'https://schema.org'
  '@type': 'ProfilePage'
  '@id': string
  'url': string
  'inLanguage': 'fr-FR'
  'isPartOf': { '@id': string }
  'mainEntity': {
    '@type': 'Person'
    '@id': string
    'name': string
    'url': string
    'image'?: string
    'sameAs'?: string[]
    'jobTitle'?: string
    'description'?: string
    'knowsAbout'?: string[]
    'worksFor': { '@id': string }
  }
}

export interface BuildProfilePageInput {
  baseUrl: string
  author: AuthorAggregate
}

const TRAILING_SLASH = /\/$/

export function buildProfilePageJsonLd(input: BuildProfilePageInput): ProfilePageJsonLd {
  const { baseUrl, author } = input
  const trimmedBase = baseUrl.replace(TRAILING_SLASH, '')
  const profileUrl = `${trimmedBase}/auteurs/${author.slug}`

  const sameAs = [author.linkedin, author.x, author.github].filter(
    (s): s is string => typeof s === 'string' && s.length > 0,
  )

  const person: ProfilePageJsonLd['mainEntity'] = {
    '@type': 'Person',
    '@id': `${profileUrl}#person`,
    'name': author.name,
    'url': profileUrl,
    'worksFor': { '@id': 'https://hoppr.tech/#organization' },
  }

  if (author.image && author.image.length > 0) {
    person.image = author.image.startsWith('http')
      ? author.image
      : `${trimmedBase}${author.image.startsWith('/') ? '' : '/'}${author.image}`
  }
  if (sameAs.length > 0)
    person.sameAs = sameAs
  if (author.jobTitle)
    person.jobTitle = author.jobTitle
  if (author.bio)
    person.description = author.bio
  if (author.knowsAbout.length > 0)
    person.knowsAbout = author.knowsAbout

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${profileUrl}#profilepage`,
    'url': profileUrl,
    'inLanguage': 'fr-FR',
    'isPartOf': { '@id': `${trimmedBase}/#website` },
    'mainEntity': person,
  }
}
