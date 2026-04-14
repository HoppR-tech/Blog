import { describe, expect, it } from 'vitest'

import { capitalize, createFolderName, slugify, stripMarkdown } from './stringUtils'

describe('capitalize', () => {
  it('should capitalize the first letter', () => {
    expect(capitalize('craft')).toBe('Craft')
  })

  it('should return empty string for empty input', () => {
    expect(capitalize('')).toBe('')
  })

  it('should handle already capitalized string', () => {
    expect(capitalize('Craft')).toBe('Craft')
  })

  it('should handle single character', () => {
    expect(capitalize('a')).toBe('A')
  })
})

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

describe('slugify', () => {
  it('should transliterate French accented characters', () => {
    expect(slugify('Connecter à un réseau hors-ligne')).toBe('connecter-a-un-reseau-hors-ligne')
  })

  it('should handle ç, è, ê, ë, à, ù, ô, î', () => {
    expect(slugify('Français façonné à Noël')).toBe('francais-faconne-a-noel')
  })

  it('should handle emojis and special characters', () => {
    expect(slugify('REX: Environnements éphémères 🦖')).toBe('rex-environnements-ephemeres')
  })

  it('should collapse multiple dashes', () => {
    expect(slugify('titre --- avec   espaces')).toBe('titre-avec-espaces')
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
