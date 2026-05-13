import type { MinimarkNode } from '@/utils/astTraversal'
import { describe, expect, it } from 'bun:test'
import { buildSpeakable, extractCitations, extractHowToSteps } from '@/utils/articleEnrichment'

type Minimark = MinimarkNode
function m(tag: string, props: Record<string, unknown>, ...kids: Minimark[]): Minimark {
  return [tag, props, ...kids] as Minimark
}
function el(tag: string, ...kids: Minimark[]): Minimark {
  return m(tag, {}, ...kids)
}

const BLOG_HOST = 'blog.hoppr.tech'

describe('extractCitations', () => {
  it('returns empty array when no <a> tags', () => {
    const body = { type: 'minimark', value: [el('p', 'Pas de lien.')] }
    expect(extractCitations(body, BLOG_HOST)).toEqual([])
  })

  it('extracts external HTTPS links with their text', () => {
    const body = {
      type: 'minimark',
      value: [
        el('p', 'Voir ', m('a', { href: 'https://example.com/x' }, 'documentation'), ' pour plus.'),
        el('p', m('a', { href: 'https://aws.amazon.com/lambda' }, 'AWS Lambda')),
      ],
    }
    const citations = extractCitations(body, BLOG_HOST)
    expect(citations).toHaveLength(2)
    expect(citations[0]).toEqual({ '@type': 'WebPage', 'url': 'https://example.com/x', 'name': 'documentation' })
    expect(citations[1]).toEqual({ '@type': 'WebPage', 'url': 'https://aws.amazon.com/lambda', 'name': 'AWS Lambda' })
  })

  it('skips internal links pointing to the blog host', () => {
    const body = {
      type: 'minimark',
      value: [
        el('p', m('a', { href: 'https://blog.hoppr.tech/blogs/other' }, 'autre article')),
        el('p', m('a', { href: 'https://www.blog.hoppr.tech/x' }, 'www variant')),
        el('p', m('a', { href: 'https://example.com' }, 'externe')),
      ],
    }
    const citations = extractCitations(body, BLOG_HOST)
    expect(citations).toHaveLength(1)
    expect(citations[0].url).toBe('https://example.com')
  })

  it('skips anchors and relative URLs', () => {
    const body = {
      type: 'minimark',
      value: [
        el('p', m('a', { href: '#section' }, 'ancre')),
        el('p', m('a', { href: '/relative' }, 'relative')),
        el('p', m('a', { href: 'https://example.com' }, 'ok')),
      ],
    }
    expect(extractCitations(body, BLOG_HOST)).toHaveLength(1)
  })

  it('dedupes URLs case-insensitively', () => {
    const body = {
      type: 'minimark',
      value: [
        el('p', m('a', { href: 'https://Example.com/Doc' }, 'X')),
        el('p', m('a', { href: 'https://example.com/Doc' }, 'Y')),
      ],
    }
    const citations = extractCitations(body, BLOG_HOST)
    expect(citations).toHaveLength(1)
  })

  it('caps at 20 citations', () => {
    const links = Array.from({ length: 25 }, (_, i) =>
      el('p', m('a', { href: `https://example${i}.com` }, `link ${i}`)))
    const body = { type: 'minimark', value: links }
    expect(extractCitations(body, BLOG_HOST)).toHaveLength(20)
  })

  it('omits name when link text is too short', () => {
    const body = {
      type: 'minimark',
      value: [el('p', m('a', { href: 'https://example.com' }, 'a'))],
    }
    const c = extractCitations(body, BLOG_HOST)
    expect(c[0]).toEqual({ '@type': 'WebPage', 'url': 'https://example.com' })
  })
})

describe('extractHowToSteps', () => {
  it('returns null when no HowTo structure detected', () => {
    const body = {
      type: 'minimark',
      value: [
        el('h2', 'Introduction'),
        el('p', 'Du contenu.'),
        el('h2', 'Conclusion'),
        el('p', 'Fin.'),
      ],
    }
    expect(extractHowToSteps(body, 'Mon article')).toBeNull()
  })

  it('extracts steps from "## Installation" container with H3 substeps', () => {
    const body = {
      type: 'minimark',
      value: [
        el('h2', 'Installation'),
        el('h3', 'Prérequis'),
        el('p', 'Installer Node.js 20 et Bun en version 1.x. Vérifier les versions avec node --version.'),
        el('h3', 'Clone du repo'),
        el('p', 'Cloner le dépôt depuis GitHub avec git clone, puis cd dans le dossier généré.'),
        el('h3', 'Lancement'),
        el('p', 'Lancer bun run dev pour démarrer le serveur de développement local sur le port 3000.'),
        el('h2', 'Suite'),
        el('p', 'Pas dans le HowTo.'),
      ],
    }
    const ld = extractHowToSteps(body, 'Setup local')
    expect(ld).not.toBeNull()
    expect(ld?.name).toBe('Setup local')
    expect(ld?.step).toHaveLength(3)
    expect(ld?.step[0].name).toBe('Prérequis')
    expect(ld?.step[0].position).toBe(1)
    expect(ld?.step[2].name).toBe('Lancement')
  })

  it('extracts steps from "Étape N" heading sequence', () => {
    const body = {
      type: 'minimark',
      value: [
        el('h2', 'Étape 1 — Préparer l\'environnement'),
        el('p', 'Détailler la préparation de l\'environnement de développement avec les bons outils.'),
        el('h2', 'Étape 2 — Lancer la migration'),
        el('p', 'Décrire la commande de migration et son comportement attendu en production.'),
      ],
    }
    const ld = extractHowToSteps(body, 'Migration')
    expect(ld).not.toBeNull()
    expect(ld?.step).toHaveLength(2)
    expect(ld?.step[0].name).toMatch(/Étape 1/)
  })

  it('skips steps with too-short text', () => {
    const body = {
      type: 'minimark',
      value: [
        el('h2', 'Installation'),
        el('h3', 'Step 1'),
        el('p', 'Court.'),
        el('h3', 'Step 2'),
        el('p', 'Une description de step 2 suffisamment longue pour passer le filtre minimum.'),
        el('h3', 'Step 3'),
        el('p', 'Une description de step 3 également suffisamment longue pour passer le filtre.'),
      ],
    }
    const ld = extractHowToSteps(body, 'Test')
    expect(ld?.step).toHaveLength(2)
  })

  it('requires at least 2 steps', () => {
    const body = {
      type: 'minimark',
      value: [
        el('h2', 'Installation'),
        el('h3', 'Seul step'),
        el('p', 'Une seule étape ne fait pas un HowTo, on retourne null.'),
      ],
    }
    expect(extractHowToSteps(body, 'X')).toBeNull()
  })
})

describe('buildSpeakable', () => {
  it('always returns h1 + first paragraph selectors', () => {
    const body = { type: 'minimark', value: [el('h1', 'Title'), el('p', 'Intro.')] }
    const ld = buildSpeakable(body)
    expect(ld).not.toBeNull()
    expect(ld?.cssSelector).toContain('h1')
    expect(ld?.cssSelector).toContain('.article-section > p:first-of-type')
  })

  it('adds recap selector when "## À retenir" is present', () => {
    const body = {
      type: 'minimark',
      value: [
        el('h1', 'Title'),
        el('p', 'Intro.'),
        el('h2', 'À retenir'),
        el('p', 'Synthèse.'),
      ],
    }
    const ld = buildSpeakable(body)
    expect(ld?.cssSelector.some(s => s.includes('data-recap') || s.includes('data-speakable'))).toBe(true)
  })

  it('matches TL;DR variant', () => {
    const body = {
      type: 'minimark',
      value: [el('h1', 'Title'), el('h2', 'TL;DR')],
    }
    const ld = buildSpeakable(body)
    expect(ld?.cssSelector.length).toBeGreaterThanOrEqual(3)
  })
})
