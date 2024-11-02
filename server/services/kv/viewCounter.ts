import { kv } from '@vercel/kv'

export async function incrementViewCount(slug: string): Promise<number> {
  try {
    const views = await kv.incr(`views:${slug}`)
    return views
  }
  catch (error) {
    console.error('Error incrementing view count:', error)
    return 0
  }
}

export async function getViewCount(slug: string): Promise<number> {
  try {
    const views = await kv.get(`views:${slug}`)
    return views as number || 0
  }
  catch (error) {
    console.error('Error getting view count:', error)
    return 0
  }
}
