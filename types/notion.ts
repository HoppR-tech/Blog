import type { Client } from '@notionhq/client'

export type NotionClientInterface = Client

export interface NotionPage {
  id: string
  properties: {
    Articles: {
      title: Array<{ plain_text: string }>
    }
    Auteurs: {
      relation: Array<{ id: string }>
    }
    Relecteurs?: {
      relation: Array<{ id: string }>
    }
    Tags: {
      multi_select: Array<{ name: string }>
    }
    'Cover Image': {
      files: Array<{ file: { url: string } }>
    }
    'Cover Image Alt': {
      rich_text: Array<{ plain_text: string }>
    }
  }
}