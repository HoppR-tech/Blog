import type { NotionPage } from '@/types/notion'

export function safeGetProperty(obj: any, path: string[], defaultValue: any = undefined) {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : defaultValue, obj)
}

export function convertToNotionPage(result: any): NotionPage {
  if (!result || typeof result.id === 'undefined' || typeof result.properties === 'undefined')
    throw new Error('Invalid result object: id and properties are required')

  return {
    id: result.id,
    properties: result.properties,
  }
}
