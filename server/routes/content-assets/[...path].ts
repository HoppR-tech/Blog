import { existsSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import { createError, defineEventHandler, getRouterParam, setResponseHeader } from 'h3'

const MIME_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
}

export default defineEventHandler((event) => {
  const path = getRouterParam(event, 'path')
  if (!path) {
    throw createError({ statusCode: 400, message: 'Missing path' })
  }

  // Prevent directory traversal
  if (path.includes('..')) {
    throw createError({ statusCode: 400, message: 'Invalid path' })
  }

  const filePath = join(process.cwd(), 'content', 'blogs', path)

  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, message: 'Asset not found' })
  }

  const ext = extname(filePath).toLowerCase()
  const mimeType = MIME_TYPES[ext]
  if (!mimeType) {
    throw createError({ statusCode: 415, message: 'Unsupported file type' })
  }

  setResponseHeader(event, 'Cache-Control', 'public, max-age=2592000') // 30 days

  return send(event, readFileSync(filePath), mimeType)
})
