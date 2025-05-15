import { convertBlocksToMarkdown } from './blockConverter'
import { getPersonsInfo } from './personInfoFetcher'
import { safeGetProperty } from './notionUtils'
import type { PageContent } from '@/types/blog'
import type { NotionClientInterface, NotionPage } from '@/types/notion'
import { checkBlocks } from '../github/postChecker'
import type { BlockObjectResponse, PartialBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

export async function getPageContent(notionClient: NotionClientInterface, page: NotionPage): Promise<PageContent> {
  try {
    const blocks = await fetchAllBlocks({notionClient, page})
    
    // Check if blocks are valid
    checkBlocks(blocks);
    
    const { markdownContent, images } = await convertBlocksToMarkdown(notionClient, blocks);
    
    const authors = await extractAuthors(notionClient, page);
    const reviewers = await extractReviewers(notionClient, page);
    const tagsNames = extractTags(page);
    const coverImage = extractCoverImage(page);
    const coverImageAlt = extractCoverImageAlt(page);

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

async function extractAuthors(notionClient: NotionClientInterface, page: NotionPage) {
  const authorsProperty = page.properties.Auteurs as { relation?: { id: string }[] }
  const authorIds = authorsProperty?.relation?.map(author => author.id) || []
  return await getPersonsInfo(notionClient, authorIds, 'Author')
}

async function extractReviewers(notionClient: NotionClientInterface, page: NotionPage) {
  const reviewersProperty = page.properties.Relecteurs as { relation?: { id: string }[] }
  const reviewerIds = reviewersProperty?.relation?.map(reviewer => reviewer.id) || []
  return await getPersonsInfo(notionClient, reviewerIds, 'Reviewer')
}

function extractTags(page: NotionPage) {
  const tags = page.properties.Tags as { multi_select?: { name: string }[] }
  return tags.multi_select?.map(tag => tag.name) || []
}

function extractCoverImage(page: NotionPage) {
  return safeGetProperty(page, ['properties', 'Cover Image', 'files', '0', 'file', 'url'], '')
}

function extractCoverImageAlt(page: NotionPage) {
  return safeGetProperty(page, ['properties', 'Cover Image Alt', 'rich_text', '0', 'plain_text'], '')
}


export async function fetchAllBlocks({notionClient, page, nextPageCursor}:{
  notionClient: NotionClientInterface, 
  page: NotionPage, 
  nextPageCursor?:string
}): Promise<BlockObjectResponse[]> {
  try {
    const response = await notionClient.blocks.children.list({ 
      block_id: page.id, 
      start_cursor: nextPageCursor 
    })
    
    const blocks = response.results.filter(isBlockObjectResponse)
    const processedBlocks = await processBlocks(notionClient, blocks)
    
    if (response.has_more && response.next_cursor) {
      const nextBlocks = await fetchAllBlocks({
        notionClient, 
        page, 
        nextPageCursor: response.next_cursor
      })
      return [...processedBlocks, ...nextBlocks]
    }
    
    return processedBlocks
  }
  catch (error) {
    console.error('❌ Error while fetching blocks:', error)
    throw error
  }
}

async function processBlocks(
  notionClient: NotionClientInterface, 
  blocks: BlockObjectResponse[]
): Promise<BlockObjectResponse[]> {
  const processedBlocks: BlockObjectResponse[] = [];

  for (const block of blocks) {
    processedBlocks.push(block);

    if (block.type === 'table') {
      await processTableBlock(notionClient, block);
    }
  }
  
  return processedBlocks;
}

async function processTableBlock(notionClient: NotionClientInterface, block: BlockObjectResponse): Promise<void> {
  try {
    console.log(`Fetching children for table block ${block.id}`);
    const tableRows = await notionClient.blocks.children.list({ block_id: block.id });

    if (!hasTableRows(tableRows)) {
      console.warn(`No rows found for table block ${block.id}`);
      return;
    }

    const firstRow = tableRows.results[0];
    console.log('Structure de la première ligne:', JSON.stringify(firstRow, null, 2));

    if (isValidTableRow(firstRow)) {
      addFormattedRowsToTable(block, tableRows);
    } else {
      addOriginalRowsToTable(block, tableRows);
    }
  } catch (tableError) {
    console.error(`Error fetching table rows for block ${block.id}:`, tableError);
  }
}

function hasTableRows(tableRows: any): boolean {
  return tableRows && tableRows.results && tableRows.results.length > 0;
}

function isValidTableRow(row: any): boolean {
  return isBlockObjectResponse(row) && 
        row.type === 'table_row' && 
        row.table_row && 
        Array.isArray(row.table_row.cells);
}

function addFormattedRowsToTable(block: BlockObjectResponse, tableRows: any): void {
  console.log('Adapting table rows from table_row format');
  const formattedRows = tableRows.results
    .filter((row: any) => row.type === 'table_row')
    .map((row: any) => ({
      cells: row.table_row?.cells || []
    }));

  ((block as any).table as any).children = formattedRows;
  console.log(`Added ${formattedRows.length} formatted rows to table block`);
}

function addOriginalRowsToTable(block: BlockObjectResponse, tableRows: any): void {
  ((block as any).table as any).children = tableRows.results.filter(isBlockObjectResponse);
  console.log(`Added ${((block as any).table as any).children.length} original rows to table block`);
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
