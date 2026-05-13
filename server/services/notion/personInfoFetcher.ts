import type { Person } from '@/types/blog'
import type { NotionClientInterface } from '@/types/notion'
import { safeGetProperty } from './notionUtils'

function extractRichText(page: unknown, propertyName: string): string | undefined {
  const richText = safeGetProperty(page, ['properties', propertyName, 'rich_text'], []) as Array<{ plain_text?: string }>
  if (!Array.isArray(richText) || richText.length === 0)
    return undefined
  const joined = richText.map(rt => rt.plain_text ?? '').join('').trim()
  return joined.length > 0 ? joined : undefined
}

export async function getPersonsInfo(notionClient: NotionClientInterface, personIds: string[], type: 'Author' | 'Reviewer'): Promise<Person[]> {
  if (personIds.length === 0)
    throw new Error(`No ${type.toLowerCase()}s found`)

  const persons: Person[] = []
  const promises = personIds.map(async (id) => {
    const personPage = await notionClient.pages.retrieve({ page_id: id })
    const name = safeGetProperty(personPage, ['properties', 'Name', 'title', '0', 'plain_text'], `Unknown ${type}`)
    const imageUrl = safeGetProperty(personPage, ['properties', 'Avatar', 'files', '0', 'file', 'url'], '')

    const person: Person = {
      notionId: personPage.id,
      name,
      image: imageUrl,
      linkedin: safeGetProperty(personPage, ['properties', 'LinkedIn', 'url']),
      x: safeGetProperty(personPage, ['properties', 'X', 'url']),
    }

    const github = safeGetProperty(personPage, ['properties', 'GitHub', 'url']) as string | undefined
    if (github)
      person.github = github

    const jobTitle = extractRichText(personPage, 'JobTitle')
    if (jobTitle)
      person.jobTitle = jobTitle

    const bio = extractRichText(personPage, 'Bio')
    if (bio)
      person.bio = bio

    return person
  })

  persons.push(...await Promise.all(promises))
  return persons
}
