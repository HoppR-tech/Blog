import { fileURLToPath } from 'node:url'
import { fetch as fetchPage, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

const rootDir = fileURLToPath(new URL('../..', import.meta.url))
const buildDir = fileURLToPath(new URL('../../node_modules/.cache/nuxt/.nuxt-e2e', import.meta.url))
const H1_PATTERN = /<h1(?:\s|>)/g
const ROBOTS_NOINDEX_PATTERN = /<meta[^>]+name="robots"[^>]+content="noindex, follow"/

function getLinkHref(html: string, rel: string): string | undefined {
  return html.match(new RegExp(`<link[^>]+rel="${rel}"[^>]+href="([^"]+)"`))?.[1]
}

function getArticleLinks(html: string): string[] {
  const links = [...html.matchAll(/href="(\/blogs\/(?!_payload\.json)[^"]+)"/g)]
    .map(match => match[1])
    .filter((href): href is string => Boolean(href))

  return [...new Set(links)]
}

function countH1(html: string): number {
  return html.match(H1_PATTERN)?.length ?? 0
}

async function getPage(path: string): Promise<{ response: Response, html: string }> {
  const response = await fetchPage(path, {
    headers: {
      accept: 'text/html',
    },
  })
  return {
    response,
    html: await response.text(),
  }
}

describe('SEO HTTP and server rendering', async () => {
  await setup({
    rootDir,
    buildDir,
    browser: false,
    setupTimeout: 240_000,
    nuxtConfig: {
      nitro: {
        preset: 'node-server',
      },
    },
  })

  it('returns a real 404 for every unknown dynamic route', async () => {
    const paths = [
      '/route-inconnue-test-seo',
      '/blogs/article-inconnu-test-seo',
      '/categories/categorie-inconnue-test-seo',
      '/tags/tag-inconnu-test-seo',
    ]

    for (const path of paths) {
      const { response, html } = await getPage(path)
      expect(response.status, path).toBe(404)
      expect(html, path).toContain('noindex')
    }
  })

  it('returns 404 for malformed and out-of-range pagination', async () => {
    const paths = [
      '/blogs?page=0',
      '/blogs?page=1.5',
      '/blogs?page=999',
      '/categories/craft?page=999',
      '/tags/craft?page=999',
    ]

    for (const path of paths) {
      const { response } = await getPage(path)
      expect(response.status, path).toBe(404)
    }
  })

  it('serves page 2 with distinct content and a self-referencing canonical', async () => {
    const page1 = await getPage('/blogs')
    const page2 = await getPage('/blogs?page=2')
    const page1Links = getArticleLinks(page1.html)
    const page2Links = getArticleLinks(page2.html)

    expect(page1.response.status).toBe(200)
    expect(page2.response.status).toBe(200)
    expect(page1Links).toHaveLength(12)
    expect(page2Links).toHaveLength(12)
    expect(page2Links).not.toEqual(page1Links)
    expect(page2Links.some(link => page1Links.includes(link))).toBe(false)
    expect(getLinkHref(page2.html, 'canonical')).toBe('https://blog.hoppr.tech/blogs?page=2')
    expect(getLinkHref(page2.html, 'prev')).toBe('/blogs')
    expect(getLinkHref(page2.html, 'next')).toBe('/blogs?page=3')
  })

  it('noindexes search results and canonicalizes them to the archive', async () => {
    const { response, html } = await getPage('/blogs?search=Kotest')

    expect(response.status).toBe(200)
    expect(html).toMatch(ROBOTS_NOINDEX_PATTERN)
    expect(getLinkHref(html, 'canonical')).toBe('https://blog.hoppr.tech/blogs')
    expect(getArticleLinks(html)).toContain(
      '/blogs/2026-07-28-property-based-testing-comment-bien-choisir-ses-proprietes-avec-kotest',
    )
  })

  it('renders tag and category hub links in the initial HTML with one H1', async () => {
    const tags = await getPage('/tags')
    const categories = await getPage('/categories')

    expect(tags.response.status).toBe(200)
    expect(categories.response.status).toBe(200)
    expect(tags.html).toContain('href="/tags/craft"')
    expect(categories.html).toContain('href="/categories/craft"')
    expect(countH1(tags.html)).toBe(1)
    expect(countH1(categories.html)).toBe(1)
  })

  it('serves paginated tag and category archives with their own canonicals', async () => {
    const tagPage = await getPage('/tags/craft?page=2')
    const categoryPage = await getPage('/categories/craft?page=2')

    expect(tagPage.response.status).toBe(200)
    expect(categoryPage.response.status).toBe(200)
    expect(getLinkHref(tagPage.html, 'canonical'))
      .toBe('https://blog.hoppr.tech/tags/craft?page=2')
    expect(getLinkHref(categoryPage.html, 'canonical'))
      .toBe('https://blog.hoppr.tech/categories/craft?page=2')
  })
})
