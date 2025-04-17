import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'
import { Client } from '@notionhq/client'
import nock from 'nock'
import { extractTitleFromPage, fetchAllBlocks, getPageContent } from './pageContentExtractor'
import type { NotionPage } from '@/types/notion'
import type { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints'
import * as blockConverter from './blockConverter'
import * as personInfoFetcher from './personInfoFetcher'

// Create mock client
const mockClient = {
  blocks: {
    children: {
      list: vi.fn()
    }
  },
  pages: {
    retrieve: vi.fn()
  }
};

// Setup mock implementations
mockClient.blocks.children.list.mockResolvedValue({
  results: [
    { type: 'paragraph', paragraph: { rich_text: [{ plain_text: 'Hello' }] } },
  ],
  has_more: false,
  next_cursor: null,
});

mockClient.pages.retrieve.mockImplementation(({ page_id }) => {
  if (page_id === '838dec96-f9fc-404f-a302-07719225d785') {
    return Promise.resolve({
      id: '838dec96-f9fc-404f-a302-07719225d785',
      properties: {
        Name: {
          title: [{ plain_text: 'Author Name' }],
        },
        Avatar: {
          files: [{ file: { url: 'http://example.com/avatar.png' } }],
        },
        LinkedIn: { url: 'http://linkedin.com/in/authorname' },
        X: { url: 'http://x.com/authorname' },
      },
    });
  } else if (page_id === '12345678-1234-1234-1234-123456789abc') {
    return Promise.resolve({
      id: '12345678-1234-1234-1234-123456789abc',
      properties: {
        Name: {
          title: [{ plain_text: 'Reviewer Name' }],
        },
        Avatar: {
          files: [{ file: { url: 'http://example.com/reviewer-avatar.png' } }],
        },
        LinkedIn: { url: 'http://linkedin.com/in/reviewername' },
        X: { url: 'http://x.com/reviewername' },
      },
    });
  }
  return Promise.reject(new Error('Unknown page ID'));
});

// Mock the blockConverter module
vi.spyOn(blockConverter, 'convertBlocksToMarkdown').mockResolvedValue({
  markdownContent: 'Hello\n\n',
  images: [],
});

// Mock the personInfoFetcher module
vi.spyOn(personInfoFetcher, 'getPersonsInfo').mockImplementation((client, ids, type) => {
  if (type === 'Author') {
    return Promise.resolve([{
      notionId: '838dec96-f9fc-404f-a302-07719225d785',
      name: 'Author Name',
      image: 'http://example.com/avatar.png',
      linkedin: 'http://linkedin.com/in/authorname',
      x: 'http://x.com/authorname',
    }]);
  } else {
    return Promise.resolve([{
      notionId: '12345678-1234-1234-1234-123456789abc',
      name: 'Reviewer Name',
      image: 'http://example.com/reviewer-avatar.png',
      linkedin: 'http://linkedin.com/in/reviewername',
      x: 'http://x.com/reviewername',
    }]);
  }
});

describe('pageContentExtractor', () => {
  it('should get page content', async () => {
    const mockPage: NotionPage = {
      id: 'page-id',
      properties: {
        'Articles': {
          title: [{ plain_text: 'Test Title' }],
        },
        'Auteurs': {
          relation: [{ id: '838dec96-f9fc-404f-a302-07719225d785' }],
        },
        'Relecteurs': {
          relation: [{ id: '12345678-1234-1234-1234-123456789abc' }],
        },
        'Tags': {
          multi_select: [{ name: 'Tag1' }, { name: 'Tag2' }],
        },
        'Cover Image': {
          files: [],
        },
        'Cover Image Alt': {
          rich_text: [],
        },
      },
    }

    // No need for nock since we're using vi mocks

    // Use our mock client
    const content = await getPageContent(mockClient, mockPage)

    expect(content.notionId).toBe('page-id')
    expect(content.title).toBe('Test Title')
    expect(content.content).toContain('Hello\n\n')
    expect(content.authors).toBeDefined()
    expect(content.authors.length).toBe(1)
    expect(content.authors[0].name).toEqual('Author Name')
    expect(content.authors[0].image).toEqual('http://example.com/avatar.png')
    expect(content.tags).toEqual(['Tag1', 'Tag2'])
    expect(content.reviewers).toBeDefined()
    expect(content.reviewers?.length).toBe(1)
    expect(content.reviewers?.[0].name).toEqual('Reviewer Name')
    expect(content.reviewers?.[0].image).toEqual('http://example.com/reviewer-avatar.png')

    // No need to check nock since we're using vi mocks
  })

  it('should extract title from a page', () => {
    const page: NotionPage = {
      id: 'page-id',
      properties: {
        'Articles': {
          title: [{ plain_text: 'Test Title' }],
        },
        'Auteurs': {
          relation: [],
        },
        'Relecteurs': {
          relation: [],
        },
        'Tags': {
          multi_select: [],
        },
        'Cover Image': {
          files: [],
        },
        'Cover Image Alt': {
          rich_text: [],
        },
      },
    }
    expect(extractTitleFromPage(page)).toBe('Test Title')
  })

  it("should fetch all blocks", async () => {
    const mockClient = {
      blocks: {
        children: {
          list: ({ block_id, start_cursor }): Promise<ListBlockChildrenResponse> => {
            if (!start_cursor) {
              return new Promise(resolve => resolve({
                object: "list",
                next_cursor: 'next-cursor',
                has_more: true,
                results: [
                  {
                    type: 'paragraph', paragraph: {
                      // @ts-expect-error for test purpose
                      rich_text: [{ plain_text: 'Hello' }]
                    }
                  },
                ],
              }))
            }

            return new Promise(resolve => resolve({
              object: "list",
              next_cursor: null,
              has_more: false,
              results: [
                {
                  type: 'paragraph', paragraph: {
                    // @ts-expect-error for test purpose
                    rich_text: [{ plain_text: 'world' }]
                  }
                },
              ],
            }))

          }

        }

      }
    } as Client;

    const mockPage: NotionPage = {
      id: 'page-id',
      properties: {
        'Articles': {
          title: [{ plain_text: 'Test Title' }],
        },
        'Auteurs': {
          relation: [{ id: '838dec96-f9fc-404f-a302-07719225d785' }],
        },
        'Relecteurs': {
          relation: [{ id: '12345678-1234-1234-1234-123456789abc' }],
        },
        'Tags': {
          multi_select: [{ name: 'Tag1' }, { name: 'Tag2' }],
        },
        'Cover Image': {
          files: [],
        },
        'Cover Image Alt': {
          rich_text: [],
        },
      },
    }

    const result = await fetchAllBlocks({ notionClient: mockClient as Client, page: mockPage })

    expect(result).toEqual(
      [
        {
          "paragraph": {
            "rich_text": [
              {
                "plain_text": "Hello",
              },
            ],
          },
          "type": "paragraph",
        },
        {
          "paragraph": {
            "rich_text": [
              {
                "plain_text": "world",
              },
            ],
          },
          "type": "paragraph",
        },
      ]
    );


  })

  afterEach(() => {
    nock.cleanAll()
  })

  afterAll(() => {
    nock.restore()
  })
})
