import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { getViewCount, incrementViewCount } from '~/server/services/redis/viewCounter'

export default defineEventHandler(async (event) => {
  // Vérifions si nous sommes en mode développement
  const isDev = process.env.NODE_ENV === 'development'
  
  // Normalize the slug by removing leading slash if present
  const rawSlug = event.context.params?.slug
  if (!rawSlug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required',
    })
  }

  console.log('Received slug in API:', rawSlug)
  
  // Ensure we have a clean slug without leading/trailing slashes
  // and remove any potential /blogs prefix
  let slug = rawSlug
  if (slug.startsWith('/')) slug = slug.slice(1)
  if (slug.endsWith('/')) slug = slug.slice(0, -1)
  if (slug.startsWith('blogs/')) slug = slug.slice(6)
  
  console.log('Normalized slug for storage:', slug)

  try {
    // Set response headers
    setResponseHeader(event, 'Content-Type', 'application/json')

    if (event.node.req.method === 'GET') {
      const views = await getViewCount(slug)
      return { views }
    }

    if (event.node.req.method === 'POST') {
      const views = await incrementViewCount(slug)
      return { views }
    }

    throw createError({
      statusCode: 405,
      message: 'Method not allowed',
    })
  }
  catch (error) {
    console.error(`Error handling view count for slug ${slug}:`, error)
    // En mode développement, fournir une réponse valide même en cas d'erreur
    if (isDev) {
      const mockViews = Math.floor(Math.random() * 100)
      console.log(`[DEV] Retournant un nombre de vues fictif en cas d'erreur: ${mockViews}`)
      return { views: mockViews }
    }
    
    throw createError({
      statusCode: 500,
      message: 'Failed to process view count',
    })
  }
})
