import { afterAll, afterEach, describe, expect, it } from 'vitest'
import { Client } from '@notionhq/client'
import nock from 'nock'
import { getPersonsInfo } from './personInfoFetcher.js'

describe('personInfoFetcher', () => {
  it('should retrieve author information correctly', async () => {
    const mockNotionClient = new Client({ auth: 'test-token' })
    const personIds = ['838dec96-f9fc-404f-a302-07719225d785', '12345678-1234-1234-1234-123456789abc']

    nock('https://api.notion.com')
      .get('/v1/pages/838dec96-f9fc-404f-a302-07719225d785')
      .reply(200, {
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
      })

    nock('https://api.notion.com')
      .get('/v1/pages/12345678-1234-1234-1234-123456789abc')
      .reply(200, {
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
      })

    const persons = await getPersonsInfo(mockNotionClient, personIds, 'Author')

    expect(persons).toHaveLength(2)
    expect(persons[0]).toEqual({
      notionId: '838dec96-f9fc-404f-a302-07719225d785',
      name: 'Author Name',
      image: 'http://example.com/avatar.png',
      linkedin: 'http://linkedin.com/in/authorname',
      x: 'http://x.com/authorname',
    })
    expect(persons[1]).toEqual({
      notionId: '12345678-1234-1234-1234-123456789abc',
      name: 'Reviewer Name',
      image: 'http://example.com/reviewer-avatar.png',
      linkedin: 'http://linkedin.com/in/reviewername',
      x: 'http://x.com/reviewername',
    })

    expect(nock.isDone()).toBe(true)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  afterAll(() => {
    nock.restore()
  })
})
