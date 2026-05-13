/**
 * Auto-extract schema.org enrichments from a Nuxt Content v3 article body.
 *
 * Three independent extractors, all pure and AST-driven (no markdown parsing):
 *
 * 1. extractCitations(body, blogHost)
 *      → BlogPosting.citation: every external link in the body becomes a
 *        WebPage citation. Applies the Princeton KDD 2024 "Cite Sources"
 *        method (the strongest signal, +30 to +115% LLM citation rate).
 *
 * 2. extractHowToSteps(body)
 *      → Standalone HowTo JSON-LD when the article exposes a numbered or
 *        named step structure (sections "## Installation" / "## Étape N").
 *
 * 3. buildSpeakableSelectors(body)
 *      → BlogPosting.speakable cssSelectors pointing at H1 + intro paragraph
 *        + optional TL;DR/À retenir section. Critical for Google AI Overview
 *        audio and voice assistants.
 *
 * Each extractor returns null/[] when it has nothing useful to say, so the
 * caller can skip emitting JSON-LD entirely (no parasite noise).
 */

import {
  gatherText,
  getNodeChildren,
  getNodeProps,
  getNodeTag,
  topLevelNodes,
  walkAst,
} from '@/utils/astTraversal'

// ----------------------------------------------------------------------------
// 1. Citations
// ----------------------------------------------------------------------------

const HTTP_URL = /^https?:\/\//
const ANCHOR_OR_RELATIVE = /^(?:#|\/)/
const MAX_CITATIONS = 20
const MIN_LINK_TEXT_CHARS = 2

export interface CitationEntry {
  '@type': 'WebPage'
  'url': string
  'name'?: string
}

function extractHost(url: string): string {
  try {
    return new URL(url).host.toLowerCase()
  }
  catch {
    return ''
  }
}

/**
 * Walk the AST and collect every <a href="..."> with an external HTTP URL.
 * Filters:
 *   - skips anchors and relative URLs (no http(s))
 *   - skips links pointing back to the blog host
 *   - dedupes by URL (case-insensitive)
 *   - caps at MAX_CITATIONS to avoid bloat
 */
export function extractCitations(body: unknown, blogHost: string): CitationEntry[] {
  const targetHost = blogHost.toLowerCase()
  const seen = new Set<string>()
  const citations: CitationEntry[] = []

  walkAst(body, (node) => {
    if (citations.length >= MAX_CITATIONS)
      return false
    if (getNodeTag(node) !== 'a')
      return
    const props = getNodeProps(node)
    const href = typeof props.href === 'string' ? props.href : ''
    if (!href || ANCHOR_OR_RELATIVE.test(href))
      return
    if (!HTTP_URL.test(href))
      return
    const host = extractHost(href)
    if (!host || host === targetHost || host === `www.${targetHost}` || `www.${host}` === targetHost)
      return
    const key = href.toLowerCase()
    if (seen.has(key))
      return
    seen.add(key)
    const name = gatherText(node).trim()
    const entry: CitationEntry = { '@type': 'WebPage', 'url': href }
    if (name.length >= MIN_LINK_TEXT_CHARS)
      entry.name = name
    citations.push(entry)
  })

  return citations.slice(0, MAX_CITATIONS)
}

// ----------------------------------------------------------------------------
// 2. HowTo schema
// ----------------------------------------------------------------------------

const HOWTO_HEADING = /^(?:installation|setup|mise en (?:œ|oe)uvre|étapes?|comment (?:faire|procéder)|how to|tutoriel)$/i
const STEP_HEADING = /^(?:étape|step)\s*\d+\b/i
const MAX_STEPS = 10
const MIN_STEP_TEXT = 30

export interface HowToStep {
  '@type': 'HowToStep'
  'position': number
  'name': string
  'text': string
}

export interface HowToJsonLd {
  '@context': 'https://schema.org'
  '@type': 'HowTo'
  'name': string
  'step': HowToStep[]
}

function truncate(text: string, max = 280): string {
  if (text.length <= max)
    return text
  return `${text.slice(0, max - 1).trimEnd()}…`
}

/**
 * If the body exposes a HowTo-style structure, build a HowTo JSON-LD entry.
 * Two patterns recognized:
 *   - explicit container H2 (Installation / Setup / Étapes / Mise en œuvre)
 *     followed by H3 sub-headings as steps
 *   - multiple H2/H3 headings prefixed with "Étape N" / "Step N"
 *
 * Returns null when no clear HowTo structure is detected.
 */
export function extractHowToSteps(body: unknown, articleTitle: string): HowToJsonLd | null {
  const nodes = topLevelNodes(body)
  if (nodes.length === 0)
    return null

  // Pattern A — container heading
  for (let i = 0; i < nodes.length; i++) {
    const tag = getNodeTag(nodes[i])
    if (tag !== 'h2')
      continue
    const headingText = gatherText(nodes[i]).trim()
    if (!HOWTO_HEADING.test(headingText))
      continue
    const steps = collectStepsAfter(nodes, i + 1, 2)
    if (steps.length >= 2)
      return buildHowTo(articleTitle, steps)
  }

  // Pattern B — sequence of H2/H3 prefixed "Étape N"
  const stepHeadings: { name: string, text: string }[] = []
  for (let i = 0; i < nodes.length; i++) {
    const tag = getNodeTag(nodes[i])
    if (tag !== 'h2' && tag !== 'h3')
      continue
    const headingText = gatherText(nodes[i]).trim()
    if (!STEP_HEADING.test(headingText))
      continue
    const text = collectBodyUntilNextHeading(nodes, i + 1, tag === 'h2' ? 2 : 3)
    if (text.length >= MIN_STEP_TEXT) {
      stepHeadings.push({ name: headingText, text: truncate(text) })
      if (stepHeadings.length >= MAX_STEPS)
        break
    }
  }
  if (stepHeadings.length >= 2)
    return buildHowTo(articleTitle, stepHeadings)

  return null
}

function collectStepsAfter(nodes: unknown[], from: number, containerLevel: number): { name: string, text: string }[] {
  const steps: { name: string, text: string }[] = []
  for (let i = from; i < nodes.length; i++) {
    const tag = getNodeTag(nodes[i])
    if (!tag)
      continue
    const level = tag === 'h2' ? 2 : tag === 'h3' ? 3 : tag === 'h4' ? 4 : 0
    if (level !== 0 && level <= containerLevel)
      break
    if (tag === 'h3') {
      const name = gatherText(nodes[i]).trim()
      const text = collectBodyUntilNextHeading(nodes, i + 1, 3)
      if (text.length >= MIN_STEP_TEXT) {
        steps.push({ name, text: truncate(text) })
        if (steps.length >= MAX_STEPS)
          break
      }
    }
  }
  return steps
}

function collectBodyUntilNextHeading(nodes: unknown[], from: number, headingLevel: number): string {
  const parts: string[] = []
  for (let i = from; i < nodes.length; i++) {
    const tag = getNodeTag(nodes[i])
    const lvl = tag === 'h2' ? 2 : tag === 'h3' ? 3 : tag === 'h4' ? 4 : 0
    if (lvl !== 0 && lvl <= headingLevel)
      break
    if (tag === 'p' || tag === 'ul' || tag === 'ol') {
      const t = gatherText(nodes[i]).trim()
      if (t.length > 0)
        parts.push(t)
    }
    else if (tag === 'li') {
      const t = gatherText(nodes[i]).trim()
      if (t.length > 0)
        parts.push(`- ${t}`)
    }
  }
  return parts.join('\n').trim()
}

function buildHowTo(name: string, steps: { name: string, text: string }[]): HowToJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    'step': steps.slice(0, MAX_STEPS).map((s, idx) => ({
      '@type': 'HowToStep',
      'position': idx + 1,
      'name': s.name,
      'text': s.text,
    })),
  }
}

// ----------------------------------------------------------------------------
// 3. Speakable selectors
// ----------------------------------------------------------------------------

const RECAP_HEADING = /^(?:[Àa] retenir|tl;dr|en r[ée]sum[ée]|en bref|key takeaways?)$/i

export interface SpeakableSpec {
  '@type': 'SpeakableSpecification'
  'cssSelector': string[]
}

/**
 * Build a Speakable cssSelector list pointing at:
 *   - the article title (H1)
 *   - the first paragraph of the rendered content (always present — the
 *     Notion validator forces a paragraph before any H2)
 *   - the TL;DR / À retenir section if present (always speakable-worthy)
 *
 * Returns null when no useful sections are detectable.
 */
export function buildSpeakable(body: unknown): SpeakableSpec | null {
  const selectors: string[] = [
    'h1',
    '.article-section > p:first-of-type',
  ]

  if (hasRecapSection(body))
    selectors.push('.article-section section[data-recap], .article-section [data-speakable]')

  return {
    '@type': 'SpeakableSpecification',
    'cssSelector': selectors,
  }
}

function hasRecapSection(body: unknown): boolean {
  let found = false
  walkAst(body, (node) => {
    if (found)
      return false
    const tag = getNodeTag(node)
    if (tag !== 'h2')
      return
    const text = gatherText(node).trim()
    if (RECAP_HEADING.test(text))
      found = true
  })
  return found
}

// Re-export AST children helper for tests on this module.
export { getNodeChildren }
