import type { Person } from '@/types/blog'
import type { CitationEntry, SpeakableSpec } from '@/utils/articleEnrichment'
import type { JsonLdNode } from '@/utils/organization'
import { buildSpeakable, extractCitations } from '@/utils/articleEnrichment'
import { categories } from '@/utils/categories'
import { buildPublisherJsonLd } from '@/utils/organization'

/**
 * Build the BlogPosting JSON-LD entity for a blog post page.
 *
 * Enriched signals for LLM crawlers & Google AI Overview:
 * - Person.url + Person.image + Person.sameAs (LinkedIn, X) when known
 * - dateModified distinct from datePublished when provided
 * - wordCount, articleSection, keywords, inLanguage
 * - image as ImageObject
 * - publisher as full Organization reference (cf. utils/organization.ts SSOT)
 */

export interface BuildBlogPostingInput {
  baseUrl: string
  path: string
  title: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  tags: string[]
  authors: Person[]
  rawBody?: string
  body?: unknown
}

export interface BlogPostingJsonLd extends JsonLdNode {
  '@context': 'https://schema.org'
  '@type': 'BlogPosting'
  'headline': string
  'description': string
  'image': {
    '@type': 'ImageObject'
    'url': string
  }
  'datePublished': string
  'dateModified': string
  'inLanguage': 'fr-FR'
  'author': Array<{
    '@type': 'Person'
    'name': string
    'url'?: string
    'image'?: string
    'sameAs'?: string[]
    'jobTitle'?: string
    'description'?: string
  }>
  'publisher': ReturnType<typeof buildPublisherJsonLd>
  'mainEntityOfPage': {
    '@type': 'WebPage'
    '@id': string
  }
  'articleSection'?: string
  'keywords'?: string
  'wordCount'?: number
  'timeRequired'?: string
  'articleBody'?: string
  'citation'?: CitationEntry[]
  'speakable'?: SpeakableSpec
  'isAccessibleForFree': true
}

const AUTHOR_SLUG_NON_ALPHANUM = /[^a-z0-9]+/g
const AUTHOR_SLUG_EDGES = /^-+|-+$/g
const COMBINING_DIACRITICS = /\p{M}/gu
const CODE_FENCE = /```[\s\S]*?```/g
const INLINE_CODE = /`[^`]*`/g
const MARKDOWN_TOKENS = /[#*_>[\]()!\-]/g
const WHITESPACE = /\s+/g
const TRAILING_SLASH = /\/$/

/**
 * Slug used to deep-link author pages (cf. need seo-authors-pages.md).
 * Stable mapping name → kebab-case ASCII.
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
 * Estimate the word count of a markdown body, excluding code blocks and inline code
 * (LLMs ignore code blocks when answering, so they shouldn't inflate wordCount either).
 */
export function estimateWordCount(rawBody: string | undefined): number | undefined {
  if (!rawBody)
    return undefined

  const cleaned = rawBody
    .replace(CODE_FENCE, ' ')
    .replace(INLINE_CODE, ' ')
    .replace(MARKDOWN_TOKENS, ' ')
    .replace(WHITESPACE, ' ')
    .trim()

  if (!cleaned)
    return undefined

  return cleaned.split(' ').filter(w => w.length > 0).length
}

/**
 * Pick the primary category label from an article's tags (first match wins).
 * Returns undefined if none of the tags map to a known category.
 */
export function findPrimaryCategoryLabel(tags: string[]): string | undefined {
  if (!tags || tags.length === 0)
    return undefined

  for (const tag of tags) {
    const cat = categories.find(c => c.value.toLowerCase() === tag.toLowerCase())
    if (cat)
      return cat.label
  }

  return undefined
}

/**
 * Build the enriched Person entry, filtering out undefined / empty fields.
 */
export function buildPersonEntry(
  baseUrl: string,
  author: Person,
): BlogPostingJsonLd['author'][number] {
  const trimmedBase = baseUrl.replace(TRAILING_SLASH, '')
  const sameAs = [author.linkedin, author.x, author.github].filter(
    (link): link is string => typeof link === 'string' && link.length > 0,
  )

  const entry: BlogPostingJsonLd['author'][number] = {
    '@type': 'Person',
    'name': author.name,
    'url': `${trimmedBase}/auteurs/${slugifyAuthorName(author.name)}`,
  }

  if (author.image && author.image.length > 0) {
    entry.image = author.image.startsWith('http')
      ? author.image
      : `${trimmedBase}${author.image.startsWith('/') ? '' : '/'}${author.image}`
  }

  if (sameAs.length > 0)
    entry.sameAs = sameAs

  if (author.jobTitle)
    entry.jobTitle = author.jobTitle
  if (author.bio)
    entry.description = author.bio

  return entry
}

export function buildBlogPostingJsonLd(input: BuildBlogPostingInput): BlogPostingJsonLd {
  const {
    baseUrl,
    path,
    title,
    description,
    image,
    datePublished,
    dateModified,
    tags,
    authors,
    rawBody,
    body,
  } = input

  const trimmedBase = baseUrl.replace(TRAILING_SLASH, '')
  const absoluteImage = image.startsWith('http')
    ? image
    : `${trimmedBase}${image.startsWith('/') ? '' : '/'}${image}`

  const jsonLd: BlogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': title,
    'description': description,
    'image': { '@type': 'ImageObject', 'url': absoluteImage },
    'datePublished': datePublished,
    'dateModified': dateModified || datePublished,
    'inLanguage': 'fr-FR',
    'author': authors.map(author => buildPersonEntry(baseUrl, author)),
    'publisher': buildPublisherJsonLd(baseUrl),
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${trimmedBase}${path}`,
    },
    'isAccessibleForFree': true,
  }

  const articleSection = findPrimaryCategoryLabel(tags)
  if (articleSection)
    jsonLd.articleSection = articleSection

  if (tags && tags.length > 0)
    jsonLd.keywords = tags.join(', ')

  const wordCount = estimateWordCount(rawBody)
  if (typeof wordCount === 'number' && wordCount > 0) {
    jsonLd.wordCount = wordCount
    // ISO 8601 duration. Reading speed 200 wpm (Average French reader).
    const minutes = Math.max(1, Math.round(wordCount / 200))
    jsonLd.timeRequired = `PT${minutes}M`
  }

  // articleBody : plain text (markdown stripped) — useful for LLM extraction
  // without parsing HTML. Cap at 5000 chars to avoid bloating the head tag.
  if (rawBody && rawBody.length > 0) {
    const plain = rawBody
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`[^`]*`/g, ' ')
      .replace(/[#*_>[\]()!]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (plain.length > 0)
      jsonLd.articleBody = plain.length > 5000 ? `${plain.slice(0, 4999)}…` : plain
  }

  // Enrichments from body AST when provided (Princeton "Cite Sources" + Speakable).
  if (body !== undefined && body !== null) {
    const blogHost = (() => {
      try {
        return new URL(trimmedBase).host
      }
      catch {
        return ''
      }
    })()
    const citations = extractCitations(body, blogHost)
    if (citations.length > 0)
      jsonLd.citation = citations

    const speakable = buildSpeakable(body)
    if (speakable)
      jsonLd.speakable = speakable
  }

  return jsonLd
}
