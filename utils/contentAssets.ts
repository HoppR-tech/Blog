/**
 * Resolve relative asset paths (./assets/...) from content articles
 * to the /content-assets/ server route.
 *
 * @param assetPath - The asset path from frontmatter (e.g., ./assets/cover.webp)
 * @param articlePath - The article path (e.g., /blogs/2024-01-01-my-article)
 * @returns The resolved URL (e.g., /content-assets/2024-01-01-my-article/assets/cover.webp)
 */
export function resolveContentAsset(assetPath: string, articlePath: string): string {
  if (!assetPath || !assetPath.startsWith('./assets/')) {
    return assetPath
  }

  // Extract article slug from path (e.g., /blogs/2024-01-01-my-article -> 2024-01-01-my-article)
  const slug = articlePath.replace(/^\/blogs\//, '').replace(/\/$/, '')
  const fileName = assetPath.replace('./', '')

  return `/content-assets/${slug}/${fileName}`
}
