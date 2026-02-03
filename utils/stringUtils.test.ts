import { describe, expect, it } from 'vitest'
import { createFolderName, stripMarkdown } from './stringUtils'

describe('createFolderName', () => {
  it('should create a folder name with the correct format', () => {
    const date = '2024-06-10'
    const title = 'Mon Article de Test'
    const expected = '2024-06-10-mon-article-de-test'
    expect(createFolderName(date, title)).toBe(expected)
  })

  it('should handle titles with special characters', () => {
    const date = '2024-06-10'
    const title = 'Article @ Test #1!'
    const expected = '2024-06-10-article-test-1'
    expect(createFolderName(date, title)).toBe(expected)
  })

  it('should handle empty title', () => {
    const date = '2024-06-10'
    const title = ''
    const expected = '2024-06-10-'
    expect(createFolderName(date, title)).toBe(expected)
  })

  it('should throw an error for invalid date', () => {
    const date = 'invalid-date'
    const title = 'Test'
    expect(() => createFolderName(date, title)).toThrow('Date invalide fournie')
  })
})

describe('stripMarkdown', () => {
  it('should strip bold markdown', () => {
    expect(stripMarkdown('Chez **HoppR**, nous')).toBe('Chez HoppR, nous')
  })

  it('should strip italic with underscores', () => {
    expect(stripMarkdown('le _Software Craftsmanship_ a')).toBe('le Software Craftsmanship a')
  })

  it('should strip italic with asterisks', () => {
    expect(stripMarkdown('le *Software Craftsmanship* a')).toBe('le Software Craftsmanship a')
  })

  it('should strip bold+italic markdown', () => {
    expect(stripMarkdown('le ***mot*** ici')).toBe('le mot ici')
  })

  it('should replace links with label text', () => {
    expect(stripMarkdown('Voir [notre site](https://hoppr.tech) ici')).toBe('Voir notre site ici')
  })

  it('should return plain text unchanged', () => {
    expect(stripMarkdown('Du texte simple')).toBe('Du texte simple')
  })
})
