/**
 * Detect and extract FAQ sections from markdown bodies, then build a
 * schema.org FAQPage JSON-LD entry.
 *
 * Convention (cf. need seo-llms-discoverability.md):
 * - The author opens a "## FAQ" or "## Questions fréquentes" section in Notion
 * - Underneath, each question is an H3 and the following paragraph(s) are the answer
 * - The next H2 (or end of body) closes the FAQ section
 *
 * The factory is pure and tested in isolation. It returns null when no FAQ
 * section is detected, so callers can skip injecting a FAQPage JSON-LD.
 */

const FAQ_HEADING = /^## (?:FAQ|Questions? fr[ée]quentes?|F\.A\.Q\.?) *$/i
const H2 = /^##\s+/
const H3 = /^### (.+)$/
const MARKDOWN_LINK = /\[([^\]]+)\]\([^)]+\)/g
const MARKDOWN_EMPHASIS = /\*{1,3}([^*]+)\*{1,3}|_{1,3}([^_]+)_{1,3}/g
const MARKDOWN_INLINE_CODE = /`([^`]+)`/g
const LINE_BREAK = /\r?\n/

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

function stripInlineMarkdown(text: string): string {
  return text
    .replace(MARKDOWN_LINK, '$1')
    .replace(MARKDOWN_EMPHASIS, (_match, p1, p2) => p1 || p2 || '')
    .replace(MARKDOWN_INLINE_CODE, '$1')
    .trim()
}

/**
 * Extract FAQ entries from a markdown body. Returns an empty array when no
 * matching section is found or when the section contains no Q/A pairs.
 */
export function extractFaqEntries(rawBody: string | undefined): FaqEntry[] {
  if (!rawBody || rawBody.length === 0)
    return []

  const lines = rawBody.split(LINE_BREAK)
  const startIndex = lines.findIndex(line => FAQ_HEADING.test(line))
  if (startIndex < 0)
    return []

  let endIndex = lines.length
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (H2.test(lines[i])) {
      endIndex = i
      break
    }
  }

  const section = lines.slice(startIndex + 1, endIndex)
  const entries: FaqEntry[] = []
  let currentQuestion: string | null = null
  let currentAnswerLines: string[] = []

  const flush = (): void => {
    if (currentQuestion === null)
      return
    const answer = stripInlineMarkdown(currentAnswerLines.join('\n').trim())
    if (answer.length > 0)
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
