import type { NotionClientInterface } from '@/types/notion'
import { Client } from '@notionhq/client'
import { NOTION_API_KEY } from '@/server/config/notionConfig'

export function getNotionClient(): NotionClientInterface {
  return new Client({ auth: NOTION_API_KEY })
}
