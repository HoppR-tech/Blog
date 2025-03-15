import { createClient } from 'redis'
import { REDIS_URL } from '../config/vercelRedisConfig'

let redis: ReturnType<typeof createClient> | null = null

export async function getRedisClient() {
  if (!redis) {
    redis = createClient({
      url: REDIS_URL,
    })

    redis.on('error', (err) => {
      console.error('Redis Client Error:', err)
    })

    await redis.connect()
  }

  return redis
}

// Fonction de nettoyage pour fermer la connexion Redis
export async function closeRedisConnection() {
  if (redis) {
    await redis.quit()
    redis = null
  }
}
