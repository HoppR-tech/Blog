import { visit } from 'unist-util-visit'

const HEADING_PATTERN = /^h([1-5])$/

/**
 * Rehype plugin that shifts all headings by +1 level.
 * H1 -> H2, H2 -> H3, etc.
 * This ensures the article content doesn't produce multiple H1 elements,
 * since H1 is reserved for the article title in the page layout.
 */
export default function rehypeHeadingShift() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const match = HEADING_PATTERN.exec(node.tagName)
      if (match) {
        const currentLevel = Number.parseInt(match[1], 10)
        const newLevel = Math.min(currentLevel + 1, 6)
        node.tagName = `h${newLevel}`
      }
    })
  }
}
