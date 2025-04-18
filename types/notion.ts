import type { Client } from '@notionhq/client'
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

export type NotionClientInterface = Client

// Ajout des types pour les équations
export type EquationBlockObjectResponse = {
  type: 'equation'
  equation: {
    expression: string
  }
} & BlockObjectResponse

export interface InlineEquationTextObject {
  type: 'equation'
  equation: {
    expression: string
  }
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
  plain_text: string
  href: string | null
}

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
