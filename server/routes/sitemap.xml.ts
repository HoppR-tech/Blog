import { SitemapStream, streamToPromise } from 'sitemap'

export default defineEventHandler(async () => {
  // Fetch all documents
  const docs = await queryCollection('blogs').all()
  const sitemap = new SitemapStream({
    hostname: 'https://example.com',
  })

  for (const doc of docs) {
    sitemap.write({
      url: doc.path,
      changefreq: 'monthly',
    })
  }
  sitemap.end()

  return streamToPromise(sitemap)
})
