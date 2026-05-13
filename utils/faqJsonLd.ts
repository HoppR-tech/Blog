/**
 * Auto-detect FAQ-style content in an article body and build a schema.org
 * FAQPage JSON-LD entry — without requiring any explicit "## FAQ" section
 * from the authors. Authors keep writing naturally; the schema is derived.
 *
 * Three strategies, applied in priority order:
 *   1. Explicit FAQ section ("## FAQ" / "## Questions fréquentes" / "## F.A.Q.")
 *   2. Interrogative headings (H2/H3 ending with "?" or starting with
 *      Pourquoi / Comment / Quand / Quel·le·s / Où / Qu'est-ce que / À quoi)
 *   3. Recap section ("## À retenir" / "## TL;DR" / "## En résumé" /
 *      "## En bref"): bullet list becomes Q/A pairs ("Que retenir : …").
 *
 * Strategies stop at the first one that yields entries. Result is capped to
 * MAX_ENTRIES (5) and answers are truncated to MAX_ANSWER_CHARS.
 *
 * The factory is pure and tested in isolation. Returns null when no
 * extraction yields entries, so callers can skip injecting a FAQPage.
 *
 * The Nuxt Content v3 body AST (minimark / legacy MDC) is first reduced to
 * a markdown-lite string via serializeAstToMarkdownLite() before parsing;
 * the strategies then operate on simple line-based text.
 */

// Re-export AST types and helpers shared with other enrichment factories.
import { gatherText, getNodeChildren, getNodeTag, topLevelNodes } from '@/utils/astTraversal'

export type { MdcAstNode, MinimarkNode } from '@/utils/astTraversal'

const FAQ_HEADING = /^## (?:FAQ|Questions? fr[ée]quentes?|F\.A\.Q\.?) *$/i
const RECAP_HEADING = /^## (?:[ÀA] retenir|TL;DR|En r[ée]sum[ée]|En bref|Key takeaways?) *$/i
const H2 = /^##\s+/
const H3 = /^### (.+)$/
const HEADING = /^(#{2,4}) (.+)$/
const MARKDOWN_LINK = /\[([^\]]+)\]\([^)]+\)/g
const MARKDOWN_EMPHASIS = /\*{1,3}([^*]+)\*{1,3}|_{1,3}([^_]+)_{1,3}/g
const MARKDOWN_INLINE_CODE = /`([^`]+)`/g
const BULLET_PREFIX = /^\s*[-*+]\s(.+)$/
const LINE_BREAK = /\r?\n/

const INTERROGATIVE_PREFIX_RE = /^(?:pourquoi|comment|quand|qu(?:el|elle|els|elles)|o[uù]|qu['’]est-ce|[àa] quoi|faut-il|peut-on|doit-on|est-il|est-ce que)\b/i

const MIN_ANSWER_CHARS = 30
const MAX_ANSWER_CHARS = 280
const MAX_ENTRIES = 5

export interface FaqEntry {
  question: string
  answer: string
}

export interface FaqJsonLd {
  '@context': 'https://schema.org'
  '@type': 'FAQPage'
  'mainEntity': Array<{
    '@type': 'Question'
    'name': string
    'acceptedAnswer': {
      '@type': 'Answer'
      'text': string
    }
  }>
}

/**
 * Re-serialize an article body AST (Nuxt Content v3 minimark or legacy MDC)
 * into a lightweight markdown string containing only the nodes that matter
 * for FAQ extraction: H2/H3/H4, paragraphs, list bullets. Code blocks,
 * images, tables, etc. are dropped on purpose — they add noise.
 *
 * Output is consumed by extractFaqEntries which already knows markdown shape.
 */
export function serializeAstToMarkdownLite(body: unknown): string {
  const nodes = topLevelNodes(body)
  if (nodes.length === 0)
    return ''

  const lines: string[] = []

  for (const node of nodes) {
    const tag = getNodeTag(node)
    if (!tag)
      continue

    if (tag === 'h2' || tag === 'h3' || tag === 'h4') {
      const hashes = tag === 'h2' ? '##' : tag === 'h3' ? '###' : '####'
      const text = gatherText(node).trim()
      if (text.length > 0)
        lines.push(`${hashes} ${text}`)
      continue
    }

    if (tag === 'p') {
      const text = gatherText(node).trim()
      if (text.length > 0)
        lines.push(text)
      continue
    }

    if (tag === 'ul' || tag === 'ol') {
      for (const li of getNodeChildren(node)) {
        if (getNodeTag(li) !== 'li')
          continue
        const text = gatherText(li).trim()
        if (text.length > 0)
          lines.push(`- ${text}`)
      }
      continue
    }
  }

  return lines.join('\n\n')
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(MARKDOWN_LINK, '$1')
    .replace(MARKDOWN_EMPHASIS, (_match, p1, p2) => p1 || p2 || '')
    .replace(MARKDOWN_INLINE_CODE, '$1')
    .trim()
}

function normalizeAnswer(rawAnswer: string): string {
  const cleaned = stripInlineMarkdown(rawAnswer.trim())
  if (cleaned.length <= MAX_ANSWER_CHARS)
    return cleaned
  return `${cleaned.slice(0, MAX_ANSWER_CHARS - 1).trimEnd()}…`
}

function isQuestionLine(line: string): boolean {
  const trimmed = line.trim()
  if (trimmed.endsWith('?') || trimmed.endsWith(' ?'))
    return true
  return INTERROGATIVE_PREFIX_RE.test(trimmed)
}

/**
 * Find the index of the first line matching `predicate`, starting at `from`.
 * Returns -1 when nothing matches.
 */
function indexOfMatch(
  lines: string[],
  predicate: (line: string) => boolean,
  from: number,
): number {
  for (let i = from; i < lines.length; i++) {
    if (predicate(lines[i]))
      return i
  }
  return -1
}

/**
 * Strategy 1 — explicit FAQ section.
 * Parses ## FAQ / Questions fréquentes / F.A.Q. then collects H3 / paragraph pairs.
 */
function extractExplicitFaqEntries(lines: string[]): FaqEntry[] {
  const startIndex = lines.findIndex(line => FAQ_HEADING.test(line))
  if (startIndex < 0)
    return []

  const endIndex = indexOfMatch(lines, H2.test.bind(H2), startIndex + 1)
  const section = lines.slice(startIndex + 1, endIndex < 0 ? lines.length : endIndex)

  const entries: FaqEntry[] = []
  let currentQuestion: string | null = null
  let currentAnswerLines: string[] = []

  const flush = (): void => {
    if (currentQuestion === null)
      return
    const answer = normalizeAnswer(currentAnswerLines.join('\n'))
    if (answer.length >= MIN_ANSWER_CHARS)
      entries.push({ question: currentQuestion, answer })
    currentAnswerLines = []
  }

  for (const line of section) {
    const h3Match = H3.exec(line)
    if (h3Match) {
      flush()
      currentQuestion = stripInlineMarkdown(h3Match[1].trim())
      continue
    }
    if (currentQuestion !== null)
      currentAnswerLines.push(line)
  }
  flush()

  return entries
}

/**
 * Strategy 2 — interrogative headings throughout the body.
 * H2/H3 that look like questions become entries; the answer is the body
 * up to the next heading of equal or higher level.
 */
function extractInterrogativeHeadingEntries(lines: string[]): FaqEntry[] {
  const entries: FaqEntry[] = []

  for (let i = 0; i < lines.length; i++) {
    const match = HEADING.exec(lines[i])
    if (!match)
      continue

    const headingLevel = match[1].length
    if (headingLevel < 2 || headingLevel > 3)
      continue

    const titleRaw = match[2].trim()
    if (!isQuestionLine(titleRaw))
      continue

    // Skip explicit FAQ section and recap section: they have their own strategies.
    if (FAQ_HEADING.test(lines[i]) || RECAP_HEADING.test(lines[i]))
      continue

    const answerLines: string[] = []
    for (let j = i + 1; j < lines.length; j++) {
      const nextMatch = HEADING.exec(lines[j])
      if (nextMatch && nextMatch[1].length <= headingLevel)
        break
      if (nextMatch)
        continue
      answerLines.push(lines[j])
    }

    const answer = normalizeAnswer(answerLines.join('\n'))
    if (answer.length >= MIN_ANSWER_CHARS) {
      const question = stripInlineMarkdown(titleRaw)
      entries.push({ question, answer })
      if (entries.length >= MAX_ENTRIES)
        break
    }
  }

  return entries
}

/**
 * Strategy 3 — recap section ("À retenir", "TL;DR", etc.).
 * Bullets become Q/A pairs prefixed with "Que retenir : ".
 * If the section has no bullets, the whole paragraph becomes a single answer
 * to "Que retenir de cet article ?".
 */
function extractRecapEntries(lines: string[]): FaqEntry[] {
  const startIndex = lines.findIndex(line => RECAP_HEADING.test(line))
  if (startIndex < 0)
    return []

  const endIndex = indexOfMatch(lines, H2.test.bind(H2), startIndex + 1)
  const section = lines
    .slice(startIndex + 1, endIndex < 0 ? lines.length : endIndex)
    .filter(line => line.trim().length > 0)

  const bullets: string[] = []
  const paragraphLines: string[] = []
  for (const line of section) {
    const bulletMatch = BULLET_PREFIX.exec(line)
    if (bulletMatch)
      bullets.push(bulletMatch[1].trim())
    else
      paragraphLines.push(line)
  }

  if (bullets.length > 0) {
    return bullets
      .slice(0, MAX_ENTRIES)
      .map<FaqEntry | null>((bullet) => {
        const answer = normalizeAnswer(bullet)
        if (answer.length < MIN_ANSWER_CHARS)
          return null
        return { question: 'Que retenir de ce point ?', answer }
      })
      .filter((entry): entry is FaqEntry => entry !== null)
  }

  const answer = normalizeAnswer(paragraphLines.join('\n'))
  if (answer.length >= MIN_ANSWER_CHARS)
    return [{ question: 'Que retenir de cet article ?', answer }]

  return []
}

/**
 * Public entry point. Applies the 3 strategies in priority order and stops at
 * the first one that yields entries.
 *
 * Returns at most MAX_ENTRIES entries.
 */
export function extractFaqEntries(rawBody: string | undefined): FaqEntry[] {
  if (!rawBody || rawBody.length === 0)
    return []

  const lines = rawBody.split(LINE_BREAK)

  const explicit = extractExplicitFaqEntries(lines)
  if (explicit.length > 0)
    return explicit.slice(0, MAX_ENTRIES)

  const interrogative = extractInterrogativeHeadingEntries(lines)
  if (interrogative.length > 0)
    return interrogative.slice(0, MAX_ENTRIES)

  return extractRecapEntries(lines)
}

export function buildFaqJsonLd(entries: FaqEntry[]): FaqJsonLd | null {
  if (entries.length === 0)
    return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': entries.map(entry => ({
      '@type': 'Question',
      'name': entry.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': entry.answer,
      },
    })),
  }
}
