import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { getPageContent } from './pageContentExtractor'
import { convertToNotionPage } from './notionUtils'
import { DATABASE_POSTS_ID } from '@/server/config/notionConfig'
import type { NotionClientInterface } from '@/types/notion'
import type { BlogPost } from '@/types/blog'

type NotionQueryResult = QueryDatabaseResponse

export async function fetchPostsToPublish(notionClient: NotionClientInterface): Promise<BlogPost[]> {
  try {
    const response: NotionQueryResult = await notionClient.databases.query({
      database_id: DATABASE_POSTS_ID,
      filter: {
        property: 'Status',
        status: { equals: 'Bon pour Publication' },
      },
    })

    const blogPosts = await Promise.all(response.results.map(result => getPageContent(notionClient, convertToNotionPage(result))))
    return blogPosts.map(convertToBlogPost)
  }
  catch (error) {
    console.error('Error while fetching articles:', error)
    throw error
  }
}

function convertToBlogPost(post: any): BlogPost {
  return {
    ...post,
    date: new Date().toISOString(),
    description: generateDescription(post.content),
    image: post.coverImage,
    alt: post.coverImageAlt,
    tags: post.tags,
    ogImage: post.coverImage,
    published: true,
    authors: post.authors,
    reviewers: post.reviewers || [],
  }
}

function generateDescription(content: string): string {
  return content.replace(/#.*\n/g, '').replace(/\n/g, ' ').substring(0, 200)
}

export async function updatePostStatus(notionClient: NotionClientInterface, pageId: string, newStatus: string): Promise<void> {
  try {
    await notionClient.pages.update({
      page_id: pageId,
      properties: {
        Status: {
          status: {
            name: newStatus,
          },
        },
      },
    })
  }
  catch (error) {
    console.error('Error while updating the status in Notion:', error)
    throw error
  }
}

export async function updatePublishedDate(notionClient: NotionClientInterface, pageId: string): Promise<void> {
  try {
    const currentDate = new Date().toISOString()
    await notionClient.pages.update({
      page_id: pageId,
      properties: {
        'Published Date': {
          date: {
            start: currentDate,
          },
        },
      },
    })
  }
  catch (error) {
    console.error('Error while updating the published date in Notion:', error)
    throw error
  }
}
