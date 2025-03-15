import { Redis } from '@upstash/redis'
import { REDIS_REST_API_TOKEN, REDIS_REST_API_URL } from '~/server/config/vercelRedisConfig'

// Vérifier si nous sommes en mode développement
const isDev = process.env.NODE_ENV === 'development'

// Créer une instance Redis uniquement en production
let redis: Redis | null = null

if (!isDev) {
  try {
    redis = new Redis({
      url: REDIS_REST_API_URL,
      token: REDIS_REST_API_TOKEN,
    })
  }
  catch (error) {
    console.warn('Failed to initialize Redis connection:', error)
    redis = null
  }
}

export async function getViewCount(slug: string): Promise<number> {
  try {
    // En mode développement, simplement retourner une valeur aléatoire
    if (isDev || !redis) {
      console.log(`[DEV] Simulant getViewCount pour ${slug}`)
      return Math.floor(Math.random() * 100)
    }

    const views = await redis.get<number>(`pageviews:${slug}`)
    return views ?? 0
  }
  catch (error) {
    console.error(`Error getting view count for ${slug}:`, error)
    return isDev ? Math.floor(Math.random() * 100) : 0
  }
}

export async function incrementViewCount(slug: string): Promise<number> {
  try {
    // En mode développement, simplement retourner une valeur aléatoire
    if (isDev || !redis) {
      console.log(`[DEV] Simulant incrementViewCount pour ${slug}`)
      return Math.floor(Math.random() * 100) + 1
    }

    const views = await redis.incr(`pageviews:${slug}`)
    return views
  }
  catch (error) {
    console.error(`Error incrementing view count for ${slug}:`, error)
    return isDev ? Math.floor(Math.random() * 100) : 0
  }
}
