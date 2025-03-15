import process from 'node:process'

const config = useRuntimeConfig()

export const REDIS_URL = process.env.REDIS_URL || config.redis.url

if (!REDIS_URL) {
  console.error('Redis configuration is incomplete')
  process.exit(1)
}
