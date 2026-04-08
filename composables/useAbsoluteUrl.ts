const TRAILING_SLASHES = /\/+$/

/**
 * Converts a relative path to an absolute URL using the configured baseUrl.
 *
 * @param path - A relative path (e.g., /content-assets/slug/assets/cover.webp)
 * @returns The absolute URL (e.g., https://blog.hoppr.tech/content-assets/slug/assets/cover.webp)
 */
export function useAbsoluteUrl(path: string): string {
  if (!path) {
    return ''
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const config = useRuntimeConfig()
  const baseUrl = (config.public.baseUrl as string).replace(TRAILING_SLASHES, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${baseUrl}${normalizedPath}`
}
