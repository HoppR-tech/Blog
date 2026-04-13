import process from 'node:process'

const config = useRuntimeConfig()

export const NOTION_API_KEY = process.env.NOTION_API_KEY || config.notion.apiKey
export const DATABASE_POSTS_ID = process.env.NOTION_DATABASE_POSTS_ID || config.notion.databasePostsId

if (!NOTION_API_KEY || !DATABASE_POSTS_ID) {
  console.error('The environment variables NOTION_API_KEY and NOTION_DATABASE_POSTS_ID must be defined.')
  process.exit(1)
}

// Cache for data_source_id resolution (Notion API v2025-09-03 / SDK v5)
let cachedDataSourceId: string | null = null

/**
 * Resolve the data_source_id from a database_id.
 * Required for Notion SDK v5 where databases.query was replaced by dataSources.query.
 */
export async function getDataSourceId(notionClient: any): Promise<string> {
  if (cachedDataSourceId)
    return cachedDataSourceId

  const database = await notionClient.databases.retrieve({ database_id: DATABASE_POSTS_ID })
  const dataSources = (database as any).data_sources
  if (!dataSources || dataSources.length === 0) {
    throw new Error(`No data sources found for database ${DATABASE_POSTS_ID}`)
  }
  const dataSourceId: string = dataSources[0].id
  cachedDataSourceId = dataSourceId
  return dataSourceId
}
