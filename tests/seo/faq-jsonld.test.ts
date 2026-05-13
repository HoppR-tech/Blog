import { describe, expect, it } from 'bun:test'
import { buildFaqJsonLd, extractFaqEntries } from '@/utils/faqJsonLd'

describe('extractFaqEntries', () => {
  it('returns an empty array when no FAQ heading is present', () => {
    const body = '## Introduction\n\nNo FAQ here.\n\n## Conclusion\n'
    expect(extractFaqEntries(body)).toEqual([])
  })

  it('returns an empty array when input is missing or empty', () => {
    expect(extractFaqEntries(undefined)).toEqual([])
    expect(extractFaqEntries('')).toEqual([])
  })

  it('extracts a single Q/A pair from a "## FAQ" section', () => {
    const body = [
      '## Introduction',
      'Hello.',
      '',
      '## FAQ',
      '',
      '### Pourquoi DDD ?',
      'Pour aligner le code et le métier.',
      '',
      '## Conclusion',
      'Voilà.',
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toEqual([
      { question: 'Pourquoi DDD ?', answer: 'Pour aligner le code et le métier.' },
    ])
  })

  it('extracts multiple Q/A pairs from a "## Questions fréquentes" section', () => {
    const body = [
      '## Questions fréquentes',
      '',
      '### Question 1 ?',
      'Réponse 1, sur deux',
      'lignes.',
      '',
      '### Question 2 ?',
      'Réponse 2.',
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(2)
    expect(entries[0]).toEqual({ question: 'Question 1 ?', answer: 'Réponse 1, sur deux\nlignes.' })
    expect(entries[1]).toEqual({ question: 'Question 2 ?', answer: 'Réponse 2.' })
  })

  it('strips inline markdown from question and answer', () => {
    const body = [
      '## FAQ',
      '',
      '### Pourquoi **DDD** ?',
      'Pour aligner le code et [le métier](https://example.com).',
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries[0].question).toBe('Pourquoi DDD ?')
    expect(entries[0].answer).toBe('Pour aligner le code et le métier.')
  })

  it('stops at the next H2 (does not bleed into the following section)', () => {
    const body = [
      '## FAQ',
      '### Q1 ?',
      'A1.',
      '## Next section',
      '### Q-from-next-section ?',
      'Should not be extracted.',
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(1)
    expect(entries[0].question).toBe('Q1 ?')
  })

  it('skips Q/A pairs with empty answers', () => {
    const body = [
      '## FAQ',
      '### Q1 ?',
      'A1.',
      '### Q2 ?',
      '',
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(1)
    expect(entries[0].question).toBe('Q1 ?')
  })

  it('matches "F.A.Q." heading variant', () => {
    const body = '## F.A.Q.\n### Q ?\nA.\n'
    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(1)
  })
})

describe('buildFaqJsonLd', () => {
  it('returns null when no entries are passed', () => {
    expect(buildFaqJsonLd([])).toBeNull()
  })

  it('builds a schema.org FAQPage with mainEntity Q/A list', () => {
    const ld = buildFaqJsonLd([
      { question: 'Q1 ?', answer: 'A1.' },
      { question: 'Q2 ?', answer: 'A2.' },
    ])

    expect(ld).not.toBeNull()
    expect(ld?.['@context']).toBe('https://schema.org')
    expect(ld?.['@type']).toBe('FAQPage')
    expect(ld?.mainEntity).toHaveLength(2)
    expect(ld?.mainEntity[0]).toEqual({
      '@type': 'Question',
      'name': 'Q1 ?',
      'acceptedAnswer': { '@type': 'Answer', 'text': 'A1.' },
    })
  })
})
