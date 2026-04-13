import type { H3Event } from 'h3'
import RSS from 'rss'
import { resolveContentAsset } from '@/utils/contentAssets'

// Server-side queryCollection has signature (event, collection) but auto-import types only expose client-side (collection)
// @ts-expect-error - Nuxt Content v3 server auto-import provides 2-arg overload at runtime
const serverQueryCollection: (event: H3Event, collection: 'blogs') => ReturnType<typeof queryCollection> = queryCollection

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteURL = config.public.baseUrl as string
  const contactName = config.public.contactName as string
  const contactEmail = config.public.contactEmail as string
  const date = new Date()

  try {
    const feed = new RSS({
      title: `Blog ${contactName}`,
      description: 'Partage, veille et ressources de la communauté sur les thématiques du Software Craftsmanship, du Cloud, de l\'architecture et de la Tech en générale.',
      feed_url: `${siteURL}/rss.xml`,
      site_url: siteURL,
      image_url: `${siteURL}/hoppr.png`,
      managingEditor: contactEmail,
      webMaster: contactEmail,
      copyright: `${date.getFullYear()} ${contactName}`,
      language: 'fr',
      pubDate: date,
      ttl: 60,
    })

    const blogPosts = await serverQueryCollection(event, 'blogs').order('date', 'DESC').all()

    for (const post of blogPosts) {
      const url = `${siteURL}${post.path}`
      const imageRelative = resolveContentAsset(post.image || '', post.path || '')
      const imageAbsolute = imageRelative ? `${siteURL}${imageRelative}` : ''

      feed.item({
        title: post.title as string,
        description: post.description || '',
        url,
        guid: url,
        tags: post.tags,
        author: post.authors?.map((author: { name: string }) => author.name).join(', ') || '',
        date: new Date(post.date),
        ...(imageAbsolute
          ? {
              enclosure: {
                url: imageAbsolute,
                type: 'image/webp',
              },
            }
          : {}),
      } as RSS.ItemOptions)
    }

    event.node.res.setHeader('Content-Type', 'application/xml')
    return feed.xml({ indent: true })
  }
  catch (err) {
    console.error('RSS feed generation failed:', err)
    event.node.res.statusCode = 500
    return '<rss version="2.0"><channel><title>Error</title></channel></rss>'
  }
})
