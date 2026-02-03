import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { getPageContent } from './pageContentExtractor'
import { convertToNotionPage } from './notionUtils'
import { generateDescription } from './descriptionGenerator'
import { DATABASE_POSTS_ID } from '@/server/config/notionConfig'
import type { NotionClientInterface } from '@/types/notion'
import type { BlogPost } from '@/types/blog'
import { categories } from '@/utils/categories'

type NotionQueryResult = QueryDatabaseResponse

export async function fetchPostsToPublish(notionClient: NotionClientInterface): Promise<BlogPost[]> {
  try {
    let allResults: any[] = [];
    let hasMore = true;
    let nextCursor: string | undefined = undefined;

    while (hasMore) {
      const response: NotionQueryResult = await notionClient.databases.query({
        database_id: DATABASE_POSTS_ID,
        filter: {
          property: 'Status',
          status: { equals: 'Bon pour Publication' },
        },
        start_cursor: nextCursor,
        page_size: 100, // Maximum permis par l'API Notion
      });

      allResults = [...allResults, ...response.results];
      hasMore = response.has_more;
      nextCursor = response.next_cursor || undefined;
    }

    const blogPosts = await Promise.all(
      allResults.map(result => getPageContent(notionClient, convertToNotionPage(result)))
    );
    return blogPosts.map(convertToBlogPost);
  }
  catch (error) {
    console.error('Error while fetching articles:', error);
    throw error;
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
