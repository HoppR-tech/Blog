import { visit } from 'unist-util-visit'

/**
 * Rehype plugin to fix heading levels in article content.
 *
 * Nuxt Content v3 / MDC applies an implicit +1 heading shift during
 * content compilation (## → h3, ### → h4, etc.). This plugin counteracts
 * that shift so that markdown heading levels are preserved in the rendered
 * HTML output:
 *   - # (h1 in markdown) → stays h2 (shifted by MDC, we keep it to avoid duplicate h1)
 *   - ## (h2 in markdown → h3 after MDC) → shifted back to h2
 *   - ### (h3 in markdown → h4 after MDC) → shifted back to h3
 *   - #### (h4 in markdown → h5 after MDC) → shifted back to h4
 *
 * This ensures proper semantic heading hierarchy (H1 > H2 > H3 > H4)
 * and resolves Lighthouse accessibility warnings about heading order.
 */
export default function rehypeHeadingShift() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const match = node.tagName.match(/^h([3-6])$/)
      if (match) {
        const level = Number(match[1])
        node.tagName = `h${level - 1}`
      }
    })
  }
}
