import { getRedisClient } from '~/server/lib/redis'

const VIEW_COUNT_PREFIX = 'views:'

export async function incrementViewCount(slug: string): Promise<number> {
  try {
    const redis = await getRedisClient()
    const key = `${VIEW_COUNT_PREFIX}${slug}`
    const views = await redis.incr(key)
    return views
  }
  catch (error) {
    console.error('Error incrementing view count:', error)
    throw error
  }
}

export async function getViewCount(slug: string): Promise<number> {
  try {
    const redis = await getRedisClient()
    const key = `${VIEW_COUNT_PREFIX}${slug}`
    const views = await redis.get(key)
    return Number.parseInt(views ?? '0', 10)
  }
  catch (error) {
    console.error('Error getting view count:', error)
    throw error
  }
}

export async function getAllViewCounts(): Promise<Record<string, number>> {
  try {
    const redis = await getRedisClient()
    const keys = await redis.keys(`${VIEW_COUNT_PREFIX}*`)

    const pipeline = redis.multi()
    keys.forEach((key) => {
      pipeline.get(key)
    })

    const results = await pipeline.exec()

    return keys.reduce((acc, key, index) => {
      const slug = key.replace(VIEW_COUNT_PREFIX, '')
      acc[slug] = Number.parseInt(results?.[index] as string ?? '0', 10)
      return acc
    }, {} as Record<string, number>)
  }
  catch (error) {
    console.error('Error getting all view counts:', error)
    throw error
  }
}

export async function resetViewCount(slug: string): Promise<void> {
  try {
    const redis = await getRedisClient()
    const key = `${VIEW_COUNT_PREFIX}${slug}`
    await redis.del(key)
  }
  catch (error) {
    console.error('Error resetting view count:', error)
    throw error
  }
}
