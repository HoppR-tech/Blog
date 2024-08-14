import { Client } from '@notionhq/client'
import { NOTION_API_KEY } from '@/server/config/notionConfig'
import type { NotionClientInterface } from '@/types/notion'

export function getNotionClient(): NotionClientInterface {
  return new Client({ auth: NOTION_API_KEY })
}
