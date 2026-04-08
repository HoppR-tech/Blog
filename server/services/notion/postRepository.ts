import type { BlogPost } from '@/types/blog'
import type { NotionClientInterface } from '@/types/notion'
import { getDataSourceId } from '@/server/config/notionConfig'
import { categories } from '@/utils/categories'
import { generateDescription } from './descriptionGenerator'
import { convertToNotionPage } from './notionUtils'
import { getPageContent } from './pageContentExtractor'

export async function fetchPostsToPublish(notionClient: NotionClientInterface): Promise<BlogPost[]> {
  try {
    const dataSourceId = await getDataSourceId(notionClient)
    let allResults: any[] = []
    let hasMore = true
    let nextCursor: string | undefined

    while (hasMore) {
      const response: any = await notionClient.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
          property: 'Status',
          status: { equals: 'Bon pour Publication' },
        },
        start_cursor: nextCursor,
        page_size: 100,
      })

      allResults = [...allResults, ...response.results]
      hasMore = response.has_more
      nextCursor = response.next_cursor || undefined
    }

    const blogPosts = await Promise.all(
      allResults.map(result => getPageContent(notionClient, convertToNotionPage(result))),
    )
    return blogPosts.map(convertToBlogPost)
  }
  catch (error) {
    console.error('Error while fetching articles:', error)
    throw error
  }
}

function convertToBlogPost(post: any): BlogPost {
  const categoryValues = categories.map(category => category.value.toLowerCase())
  const hasValidCategory = post.tags.some((tag: string) => categoryValues.includes(tag.toLowerCase()))

  if (!hasValidCategory) {
    const errorMessage = `The article "${post.title}" does not have a valid category. Please add one of the following categories to the article's tags: ${categories.map(c => c.value).join(', ')}.`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

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
