import RSS from 'rss'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteURL = config.public.baseUrl as string
  const contactName = config.public.contactName as string
  const contactEmail = config.public.contactEmail as string
  const date = new Date()

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

  const docs = await serverQueryContent(event).sort({ date: -1 }).where({ _partial: false }).find()
  const blogPosts = docs.filter(doc => doc?._path?.includes('/blog'))

  for (const post of blogPosts) {
    const url = `${siteURL}${post._path}`
    feed.item({
      title: post.title as string,
      description: post.description,
      url,
      guid: url,
      categories: post.tags,
      author: post.authors.map((author: { name: string }) => author.name).join(', '),
      date: new Date(post.date),
      enclosure: {
        url: post.image,
        type: 'image/webp',
      },
    })
  }

  event.node.res.setHeader('Content-Type', 'application/xml')
  return feed.xml({ indent: true })
})
