import { describe, expect, it } from 'vitest'
import { generateDescription } from './descriptionGenerator'

describe('generateDescription', () => {
    it('should strip bold markdown from description', () => {
        const content = 'Chez **HoppR**, nous pensons\n'
        expect(generateDescription(content)).toBe('Chez HoppR, nous pensons ')
    })

    it('should strip italic markdown with underscores from description', () => {
        const content = 'le _Software Craftsmanship_ a rappelé\n'
        expect(generateDescription(content)).toBe('le Software Craftsmanship a rappelé ')
    })

    it('should strip italic markdown with asterisks from description', () => {
        const content = 'le *Software Craftsmanship* a rappelé\n'
        expect(generateDescription(content)).toBe('le Software Craftsmanship a rappelé ')
    })

    it('should strip bold+italic markdown from description', () => {
        const content = 'le ***Software Craftsmanship*** a rappelé\n'
        expect(generateDescription(content)).toBe('le Software Craftsmanship a rappelé ')
    })

    it('should replace markdown links with their label text', () => {
        const content = 'Voir [notre site](https://hoppr.tech) pour plus\n'
        expect(generateDescription(content)).toBe('Voir notre site pour plus ')
    })

    it('should strip all markdown formatting combined', () => {
        const content = 'Le **Platform _Engineering_** avec [HoppR](https://hoppr.tech)\n'
        expect(generateDescription(content)).toBe('Le Platform Engineering avec HoppR ')
    })

    it('should still remove headings and newlines', () => {
        const content = '# Titre\nDu texte simple\n'
        expect(generateDescription(content)).toBe('Du texte simple ')
    })

    it('should still truncate to 200 characters', () => {
        const content = 'A'.repeat(250) + '\n'
        expect(generateDescription(content)).toHaveLength(200)
    })
})
