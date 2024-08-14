import { safeGetProperty } from './notionUtils'
import type { NotionClientInterface } from '@/types/notion'
import type { Person } from '@/types/blog'

export async function getPersonsInfo(notionClient: NotionClientInterface, personIds: string[], type: 'Author' | 'Reviewer'): Promise<Person[]> {
  if (personIds.length === 0)
    throw new Error(`No ${type.toLowerCase()}s found`)

  const persons: Person[] = []
  const promises = personIds.map(async (id) => {
    const personPage = await notionClient.pages.retrieve({ page_id: id })
    const name = safeGetProperty(personPage, ['properties', 'Name', 'title', '0', 'plain_text'], `Unknown ${type}`)
    const imageUrl = safeGetProperty(personPage, ['properties', 'Avatar', 'files', '0', 'file', 'url'], '')

    return {
      notionId: personPage.id,
      name,
      image: imageUrl,
      linkedin: safeGetProperty(personPage, ['properties', 'LinkedIn', 'url']),
      x: safeGetProperty(personPage, ['properties', 'X', 'url']),
    }
  })

  persons.push(...await Promise.all(promises))
  return persons
}
