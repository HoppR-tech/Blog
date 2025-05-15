import { convertBlocksToMarkdown } from './blockConverter'
import { getPersonsInfo } from './personInfoFetcher'
import { safeGetProperty } from './notionUtils'
import type { PageContent } from '@/types/blog'
import type { NotionClientInterface, NotionPage } from '@/types/notion'
import { checkBlocks } from '../github/postChecker'
import type { BlockObjectResponse, PartialBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

export async function getPageContent(notionClient: NotionClientInterface, page: NotionPage): Promise<PageContent> {
  try {
    const blocks = await fetchAllBlocks({notionClient,
      page})

    // Check if blocks are valid
    checkBlocks(blocks);

    const { markdownContent, images } = await convertBlocksToMarkdown(notionClient, blocks);

    const authorsProperty = page.properties.Auteurs as { relation?: { id: string }[] }
    const authorIds = authorsProperty?.relation?.map(author => author.id) || []
    const authors = await getPersonsInfo(notionClient, authorIds, 'Author')

    const reviewersProperty = page.properties.Relecteurs as { relation?: { id: string }[] }
    const reviewerIds = reviewersProperty?.relation?.map(reviewer => reviewer.id) || []
    const reviewers = await getPersonsInfo(notionClient, reviewerIds, 'Reviewer')

    const tags = page.properties.Tags as { multi_select?: { name: string }[] }
    const tagsNames = tags.multi_select?.map(tag => tag.name) || []

    const coverImage = safeGetProperty(page, ['properties', 'Cover Image', 'files', '0', 'file', 'url'], '')
    const coverImageAlt = safeGetProperty(page, ['properties', 'Cover Image Alt', 'rich_text', '0', 'plain_text'], '')

    return {
      notionId: page.id,
      title: extractTitleFromPage(page),
      authors,
      reviewers,
      coverImage,
      coverImageAlt,
      tags: tagsNames,
      content: markdownContent,
      images,
    }
  }
  catch (error) {
    console.error('Error while retrieving the page:', error)
    throw error
  }
}


export async function fetchAllBlocks({notionClient,page, nextPageCursor}:{notionClient: NotionClientInterface, page: NotionPage, nextPageCursor?:string}): Promise<BlockObjectResponse[]> {
  let blocks: BlockObjectResponse[];
  try {
    const response = await notionClient.blocks.children.list({ block_id: page.id, start_cursor: nextPageCursor })
    blocks = response.results.filter(isBlockObjectResponse)

    // Traiter les blocs spéciaux comme les tableaux qui peuvent avoir des enfants
    const processedBlocks: BlockObjectResponse[] = [];

    for (const block of blocks) {
      processedBlocks.push(block);

      // Si c'est un tableau, récupérer ses enfants (lignes)
      if (block.type === 'table') {
        try {
          console.log(`Fetching children for table block ${block.id}`);
          const tableRows = await notionClient.blocks.children.list({ block_id: block.id });

          // Ajouter les données des lignes au bloc tableau
          if (tableRows && tableRows.results && tableRows.results.length > 0) {
            (block.table as any).children = tableRows.results.filter(isBlockObjectResponse);
            console.log(`Added ${(block.table as any).children.length} rows to table block`);
          }
        } catch (tableError) {
          console.error(`Error fetching table rows for block ${block.id}:`, tableError);
        }
      }
    }

    if (response.has_more && response.next_cursor) {
      const nextBlocks = await fetchAllBlocks({notionClient, page, nextPageCursor: response.next_cursor})
      blocks = [...processedBlocks, ...nextBlocks]
    } else {
      blocks = processedBlocks;
    }
  }
  catch (error) {
    console.error('❌ Error while fetching blocks:', error)
    throw error
  }
  return blocks
}


export function extractTitleFromPage(page: NotionPage): string {
  const post = page.properties.Articles
  if (!post || !Array.isArray(post.title) || post.title.length === 0)
    throw new Error('Title property not found in page')

  const title = post.title[0].plain_text
  if (!title || title.trim() === '')
    throw new Error('Title is missing or empty')

  return title
}

function isBlockObjectResponse(item: PartialBlockObjectResponse | BlockObjectResponse): item is BlockObjectResponse {
  return "type" in item;
}
