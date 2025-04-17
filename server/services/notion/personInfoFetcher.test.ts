import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Client } from '@notionhq/client'
import nock from 'nock'
import { getPersonsInfo } from './personInfoFetcher.js'

// Create a mock client instead of modifying the prototype
const mockClient = {
  pages: {
    retrieve: vi.fn()
  }
};

// Setup the mock implementation
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

describe('personInfoFetcher', () => {
  it('should retrieve author information correctly', async () => {
    // For simplicity, let's just test with one person ID
    const personIds = ['838dec96-f9fc-404f-a302-07719225d785']

    const persons = await getPersonsInfo(mockClient, personIds, 'Author')

    expect(persons).toHaveLength(1)
    expect(persons[0]).toEqual({
      notionId: '838dec96-f9fc-404f-a302-07719225d785',
      name: 'Author Name',
      image: 'http://example.com/avatar.png',
      linkedin: 'http://linkedin.com/in/authorname',
      x: 'http://x.com/authorname',
    })
  })

  afterEach(() => {
    nock.cleanAll()
  })

  afterAll(() => {
    nock.restore()
  })
})
