import type { MdcAstNode } from '@/utils/faqJsonLd'
import { describe, expect, it } from 'bun:test'
import { buildFaqJsonLd, extractFaqEntries, serializeAstToMarkdownLite } from '@/utils/faqJsonLd'

const LONG_ANSWER = 'Une réponse longue qui dépasse les trente caractères minimum requis pour être retenue dans le FAQ.'

describe('extractFaqEntries — no body / empty body', () => {
  it('returns an empty array for missing or empty input', () => {
    expect(extractFaqEntries(undefined)).toEqual([])
    expect(extractFaqEntries('')).toEqual([])
  })

  it('returns an empty array when no FAQ signals exist', () => {
    const body = '## Introduction\nDu contenu sans question ni récap.\n## Conclusion\nFin.\n'
    expect(extractFaqEntries(body)).toEqual([])
  })
})

describe('extractFaqEntries — strategy 1: explicit "## FAQ" section', () => {
  it('extracts Q/A pairs from an explicit FAQ section', () => {
    const body = [
      '## FAQ',
      '',
      '### Pourquoi DDD ?',
      `${LONG_ANSWER} Cela aligne le code et le métier.`,
      '',
      '### Comment commencer ?',
      `${LONG_ANSWER} En lisant Eric Evans.`,
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(2)
    expect(entries[0].question).toBe('Pourquoi DDD ?')
    expect(entries[1].question).toBe('Comment commencer ?')
  })

  it('matches "Questions fréquentes" variant', () => {
    const body = `## Questions fréquentes\n### Q ?\n${LONG_ANSWER}\n`
    expect(extractFaqEntries(body)).toHaveLength(1)
  })

  it('matches "F.A.Q." variant', () => {
    const body = `## F.A.Q.\n### Q ?\n${LONG_ANSWER}\n`
    expect(extractFaqEntries(body)).toHaveLength(1)
  })

  it('strips inline markdown from question and answer', () => {
    const body = [
      '## FAQ',
      '### Pourquoi **DDD** ?',
      `${LONG_ANSWER} Voir [Eric Evans](https://example.com).`,
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries[0].question).toBe('Pourquoi DDD ?')
    expect(entries[0].answer).toContain('Voir Eric Evans')
    expect(entries[0].answer).not.toContain('[')
    expect(entries[0].answer).not.toContain('**')
  })

  it('stops at the next H2 (no bleed into following section)', () => {
    const body = [
      '## FAQ',
      `### Q1 ?\n${LONG_ANSWER}`,
      '## Conclusion',
      `### Q-not-in-faq ?\n${LONG_ANSWER}`,
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(1)
    expect(entries[0].question).toBe('Q1 ?')
  })

  it('skips Q/A pairs with too-short answers (< 30 chars)', () => {
    const body = [
      '## FAQ',
      '### Q1 ?',
      `${LONG_ANSWER}`,
      '### Q2 ?',
      'Court.',
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(1)
  })
})

describe('extractFaqEntries — strategy 2: interrogative headings auto-detection', () => {
  it('detects an H2 ending with "?" and uses the following body as answer', () => {
    const body = [
      '## Introduction',
      'Texte de présentation.',
      '',
      '## Pourquoi adopter le Domain-Driven Design ?',
      `${LONG_ANSWER} Cela aligne le code sur le métier.`,
      '',
      '## Et après ?',
      'Trop court.',
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries.length).toBeGreaterThanOrEqual(1)
    const first = entries.find(e => e.question.startsWith('Pourquoi'))
    expect(first?.question).toBe('Pourquoi adopter le Domain-Driven Design ?')
    expect(first?.answer).toContain('aligne le code')
  })

  it('detects interrogative prefixes (Pourquoi, Comment, Quand, Qu\'est-ce que) without "?"', () => {
    const body = [
      '## Comment fonctionne un circuit breaker',
      `${LONG_ANSWER} Il coupe la chaîne d'appels distants en cas d'échec.`,
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(1)
    expect(entries[0].question.toLowerCase()).toContain('comment fonctionne')
  })

  it('handles H3 questions inside a parent H2', () => {
    const body = [
      '## Architecture résiliente',
      'Intro.',
      '',
      '### Qu\'est-ce qu\'un bulkhead ?',
      `${LONG_ANSWER} Un cloisonnement qui isole les ressources.`,
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(1)
    expect(entries[0].question).toMatch(/bulkhead/i)
  })

  it('stops collecting the answer at the next heading of equal or higher level', () => {
    const body = [
      '## Pourquoi DDD ?',
      `${LONG_ANSWER} Première phrase de la réponse.`,
      '',
      '### Sous-section',
      'Plus de contenu.',
      '',
      '## Section suivante',
      'Pas dans la réponse de Pourquoi DDD.',
    ].join('\n')

    const entries = extractFaqEntries(body)
    const ddd = entries.find(e => e.question.startsWith('Pourquoi DDD'))
    expect(ddd?.answer).toContain('Première phrase')
    expect(ddd?.answer).not.toContain('Pas dans la réponse')
  })

  it('truncates answers longer than 280 characters with an ellipsis', () => {
    const longText = 'A'.repeat(500)
    const body = `## Pourquoi ?\n${longText}\n`

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(1)
    expect(entries[0].answer.length).toBeLessThanOrEqual(280)
    expect(entries[0].answer.endsWith('…')).toBe(true)
  })

  it('caps the number of entries at 5 even if the article has more questions', () => {
    const body = Array.from({ length: 8 }, (_, i) =>
      `## Pourquoi item ${i + 1} ?\n${LONG_ANSWER} Item ${i + 1}.\n`).join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(5)
  })
})

describe('extractFaqEntries — strategy 3: recap section', () => {
  it('builds Q/A from each bullet in an "À retenir" section', () => {
    const body = [
      '## Introduction',
      'Texte.',
      '',
      '## À retenir',
      '- Premier point à retenir, suffisamment long pour passer le filtre.',
      '- Deuxième point à retenir, également long pour le filtre minimum.',
      '- Troisième point, encore une fois assez long pour être pertinent ici.',
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(3)
    expect(entries[0].question).toBe('Que retenir de ce point ?')
    expect(entries[0].answer).toContain('Premier point')
  })

  it('matches "TL;DR" variant', () => {
    const body = `## TL;DR\n- ${LONG_ANSWER}\n`
    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(1)
  })

  it('matches "En résumé" variant', () => {
    const body = `## En résumé\n- ${LONG_ANSWER}\n`
    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(1)
  })

  it('falls back to a single Q/A when the recap has no bullets', () => {
    const body = [
      '## À retenir',
      `${LONG_ANSWER} Synthèse de l'article en un paragraphe.`,
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(1)
    expect(entries[0].question).toBe('Que retenir de cet article ?')
  })

  it('caps recap bullets at 5', () => {
    const bullets = Array.from({ length: 8 }, (_, i) => `- ${LONG_ANSWER} Item ${i + 1}.`).join('\n')
    const body = `## À retenir\n${bullets}\n`
    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(5)
  })

  it('skips bullets with too-short answers', () => {
    const body = [
      '## À retenir',
      `- ${LONG_ANSWER}`,
      '- Court.',
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(1)
  })
})

describe('extractFaqEntries — priority ordering between strategies', () => {
  it('uses explicit FAQ when both explicit FAQ and recap exist', () => {
    const body = [
      '## FAQ',
      `### Question explicite ?\n${LONG_ANSWER}`,
      '',
      '## À retenir',
      `- ${LONG_ANSWER} Ce bullet ne doit pas apparaître.`,
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(1)
    expect(entries[0].question).toBe('Question explicite ?')
  })

  it('uses interrogative headings when explicit FAQ is absent', () => {
    const body = [
      '## Pourquoi adopter X ?',
      `${LONG_ANSWER} Réponse interrogative.`,
      '',
      '## À retenir',
      `- ${LONG_ANSWER} Bullet recap ignoré au profit de la stratégie 2.`,
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries[0].question).toBe('Pourquoi adopter X ?')
  })

  it('falls back to recap when neither explicit FAQ nor interrogative headings exist', () => {
    const body = [
      '## Introduction',
      'Pas de question.',
      '',
      '## Détails',
      'Toujours pas.',
      '',
      '## TL;DR',
      `- ${LONG_ANSWER}`,
    ].join('\n')

    const entries = extractFaqEntries(body)
    expect(entries).toHaveLength(1)
    expect(entries[0].question).toBe('Que retenir de ce point ?')
  })
})

describe('serializeAstToMarkdownLite — Nuxt Content v3 body AST → markdown-lite', () => {
  function text(value: string): MdcAstNode {
    return { type: 'text', value }
  }

  function element(tag: string, children: MdcAstNode[]): MdcAstNode {
    return { type: 'element', tag, children }
  }

  it('returns an empty string for undefined / empty body', () => {
    expect(serializeAstToMarkdownLite(undefined)).toBe('')
    expect(serializeAstToMarkdownLite(null)).toBe('')
    expect(serializeAstToMarkdownLite({ children: [] })).toBe('')
  })

  it('serializes H2 / H3 / H4 with the right number of hashes', () => {
    const body: MdcAstNode = {
      children: [
        element('h2', [text('Pourquoi DDD ?')]),
        element('h3', [text('Bounded Context')]),
        element('h4', [text('Ubiquitous Language')]),
      ],
    }
    const out = serializeAstToMarkdownLite(body)
    expect(out).toContain('## Pourquoi DDD ?')
    expect(out).toContain('### Bounded Context')
    expect(out).toContain('#### Ubiquitous Language')
  })

  it('serializes paragraphs as plain lines', () => {
    const body: MdcAstNode = {
      children: [
        element('p', [text('Première phrase.')]),
        element('p', [text('Deuxième phrase.')]),
      ],
    }
    expect(serializeAstToMarkdownLite(body)).toContain('Première phrase.')
    expect(serializeAstToMarkdownLite(body)).toContain('Deuxième phrase.')
  })

  it('serializes ul / ol bullets with "-" prefix', () => {
    const body: MdcAstNode = {
      children: [
        element('ul', [
          element('li', [text('Premier item')]),
          element('li', [text('Deuxième item')]),
        ]),
      ],
    }
    const out = serializeAstToMarkdownLite(body)
    expect(out).toContain('- Premier item')
    expect(out).toContain('- Deuxième item')
  })

  it('flattens nested text nodes inside elements (e.g. <strong> inside <h2>)', () => {
    const body: MdcAstNode = {
      children: [
        element('h2', [
          text('Pourquoi '),
          element('strong', [text('DDD')]),
          text(' ?'),
        ]),
      ],
    }
    expect(serializeAstToMarkdownLite(body)).toContain('## Pourquoi DDD ?')
  })

  it('drops code blocks, images, tables (only headings/paragraphs/lists survive)', () => {
    const body: MdcAstNode = {
      children: [
        element('h2', [text('Section')]),
        element('pre', [text('const noise = true')]),
        element('img', []),
        element('table', [element('tr', [element('td', [text('cell')])])]),
        element('p', [text('Real content.')]),
      ],
    }
    const out = serializeAstToMarkdownLite(body)
    expect(out).toContain('## Section')
    expect(out).toContain('Real content.')
    expect(out).not.toContain('const noise')
    expect(out).not.toContain('cell')
  })

  it('end-to-end: AST body with interrogative H2 produces a FAQ entry', () => {
    const body: MdcAstNode = {
      children: [
        element('h2', [text('Pourquoi adopter le DDD ?')]),
        element('p', [text('Pour aligner le code sur le métier et clarifier les frontières des bounded contexts dans un système complexe.')]),
        element('h2', [text('Conclusion')]),
        element('p', [text('Voilà.')]),
      ],
    }
    const md = serializeAstToMarkdownLite(body)
    const entries = extractFaqEntries(md)
    expect(entries).toHaveLength(1)
    expect(entries[0].question).toBe('Pourquoi adopter le DDD ?')
    expect(entries[0].answer).toContain('aligner le code')
  })

  it('end-to-end: AST body with "## À retenir" bullets produces recap entries', () => {
    const body: MdcAstNode = {
      children: [
        element('h2', [text('À retenir')]),
        element('ul', [
          element('li', [text('Premier apprentissage de l\'article, suffisamment développé pour passer le filtre.')]),
          element('li', [text('Deuxième apprentissage de l\'article, également développé pour passer le filtre.')]),
        ]),
      ],
    }
    const md = serializeAstToMarkdownLite(body)
    const entries = extractFaqEntries(md)
    expect(entries).toHaveLength(2)
    expect(entries[0].question).toBe('Que retenir de ce point ?')
  })
})

describe('buildFaqJsonLd', () => {
  it('returns null for an empty list', () => {
    expect(buildFaqJsonLd([])).toBeNull()
  })

  it('builds a valid FAQPage with mainEntity', () => {
    const ld = buildFaqJsonLd([
      { question: 'Q1 ?', answer: 'A1, suffisamment longue pour passer.' },
    ])
    expect(ld?.['@context']).toBe('https://schema.org')
    expect(ld?.['@type']).toBe('FAQPage')
    expect(ld?.mainEntity[0]).toEqual({
      '@type': 'Question',
      'name': 'Q1 ?',
      'acceptedAnswer': { '@type': 'Answer', 'text': 'A1, suffisamment longue pour passer.' },
    })
  })
})
