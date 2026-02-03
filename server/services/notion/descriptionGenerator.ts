import { stripMarkdown } from '@/utils/stringUtils'

export function generateDescription(content: string): string {
  const cleaned = stripMarkdown(
    content.replace(/#.*\n/g, '').replace(/\n/g, ' ')
  )
  const limit = 200

  if (cleaned.length <= limit) return cleaned

  return cleaned.substring(0, limit)
}
