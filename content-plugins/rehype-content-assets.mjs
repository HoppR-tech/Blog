import { visit } from 'unist-util-visit'

/**
 * Rehype plugin that transforms relative asset paths in content markdown.
 * Converts ./assets/image.webp to /content-assets/{slug}/assets/image.webp
 */
export default function rehypeContentAssets() {
  return (tree, file) => {
    const filePath = file?.path || file?.history?.[0] || ''
    const match = filePath.match(/content\/blogs\/([^/]+)\//)
    if (!match)
      return

    const slug = match[1]

    visit(tree, 'element', (node) => {
      if (node.tagName === 'img' && node.properties?.src) {
        const src = node.properties.src
        if (src.startsWith('./assets/') || src.startsWith('assets/')) {
          node.properties.src = `/content-assets/${slug}/${src.replace('./', '')}`
        }
      }
    })
  }
}
