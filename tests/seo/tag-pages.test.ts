import { describe, expect, it } from 'bun:test'
import { capitalize } from '@/utils/stringUtils'

/**
 * Tag page title tests.
 * TASK-050: Tag page title should have first letter capitalized.
 */

describe('tag pages - title capitalization (TASK-050)', () => {
  it('should capitalize the first letter of the tag in the title', () => {
    // Given: a tag slug "craft"
    const tag = 'craft'

    // When: we capitalize it for the title
    const title = capitalize(tag)

    // Then: it becomes "Craft"
    expect(title).toBe('Craft')
  })

  it('should capitalize "devops" to "Devops"', () => {
    const title = capitalize('devops')
    expect(title).toBe('Devops')
  })

  it('should handle already capitalized tags', () => {
    const title = capitalize('TypeScript')
    expect(title).toBe('TypeScript')
  })

  it('should return empty string for empty input', () => {
    const title = capitalize('')
    expect(title).toBe('')
  })

  it('should generate correct description for a tag', () => {
    const tag = 'craft'
    const description = `Découvrez nos articles sur le thème ${capitalize(tag)}.`
    expect(description).toBe('Découvrez nos articles sur le thème Craft.')
  })
})
