import { defineEventHandler } from 'h3'
import { incrementViewCount } from '~/server/services/redis/viewCounter'

export default defineEventHandler(async (event) => {
  // Vérifions si nous sommes en mode développement
  const isDev = process.env.NODE_ENV === 'development'
  
  const slug = event.context.params?.slug

  if (!slug) {
    return {
      statusCode: 400,
      body: { error: 'Slug parameter is required' },
    }
  }

  try {
    const views = await incrementViewCount(slug)
    return { views }
  }
  catch (error) {
    console.error('Error incrementing view count:', error)
    
    // En mode développement, retournons une valeur fictive plutôt qu'une erreur
    if (isDev) {
      const mockViews = Math.floor(Math.random() * 100)
      console.log(`[DEV] Retournant un nombre de vues fictif en cas d'erreur: ${mockViews}`)
      return { views: mockViews }
    }
    
    return {
      statusCode: 500,
      body: { error: 'Failed to increment view count' },
    }
  }
})
