import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blogs: defineCollection({
      type: 'page',
      source: 'blogs/**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
        image: z.string().optional(),
        alt: z.string().optional(),
        ogImage: z.string().optional(),
        tags: z.array(z.string()).optional().default([]),
        published: z.boolean().optional().default(false),
        authors: z.array(z.object({
          id: z.string(),
          name: z.string(),
          image: z.string().optional(),
          linkedin: z.string().optional(),
          x: z.string().optional(),
        })).optional().default([]),
        reviewers: z.array(z.object({
          id: z.string(),
          name: z.string(),
          image: z.string().optional(),
          linkedin: z.string().optional(),
          x: z.string().optional(),
        })).optional().default([]),
      }),
    }),
  },
})
