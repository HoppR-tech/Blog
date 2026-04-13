import { visit } from 'unist-util-visit'

/**
 * Rehype plugin that shifts only H1 headings to H2.
 * This prevents multiple H1 elements on the page (H1 is reserved for the
 * article title in the page layout) while preserving the heading hierarchy
 * for H2 and below, so articles maintain proper heading order (H2 -> H3 -> ...).
 */
export default function rehypeHeadingShift() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h1') {
        node.tagName = 'h2'
      }
    })
  }
}
