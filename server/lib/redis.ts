import { Redis } from '@upstash/redis'
import { REDIS_REST_API_TOKEN, REDIS_REST_API_URL } from '../config/vercelRedisConfig'

export const redis = new Redis({
  url: REDIS_REST_API_URL,
  token: REDIS_REST_API_TOKEN,
})
