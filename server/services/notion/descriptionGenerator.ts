import { SEO_DESCRIPTION_MAX_LENGTH } from '@/utils/seoLimits'
import { stripMarkdown } from '@/utils/stringUtils'

const MARKDOWN_HEADING = /^#{1,6}(?:\s|$)/

export function generateDescription(content: string): string {
  const contentWithoutHeadings = content
    .split('\n')
    .filter(line => !MARKDOWN_HEADING.test(line.trimStart()))
    .join(' ')
  const cleaned = stripMarkdown(contentWithoutHeadings).replace(/\s+/g, ' ').trim()

  if (cleaned.length <= SEO_DESCRIPTION_MAX_LENGTH)
    return cleaned

  const candidate = cleaned.slice(0, SEO_DESCRIPTION_MAX_LENGTH - 1).trimEnd()
  const lastSpace = candidate.lastIndexOf(' ')
  const truncated = lastSpace > 0 ? candidate.slice(0, lastSpace) : candidate

  return `${truncated}…`
}
