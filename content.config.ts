import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { SEO_DESCRIPTION_MAX_LENGTH, SEO_TITLE_MAX_LENGTH } from './utils/seoLimits'

export default defineContentConfig({
  collections: {
    blogs: defineCollection({
      type: 'page',
      source: 'blogs/**/*.md',
      schema: z.object({
        title: z.string(),
        seoTitle: z.string().max(SEO_TITLE_MAX_LENGTH).optional(),
        date: z.string(),
        description: z.string(),
        seoDescription: z.string().max(SEO_DESCRIPTION_MAX_LENGTH).optional(),
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
          github: z.string().optional(),
          jobTitle: z.string().optional(),
          bio: z.string().optional(),
        })).optional().default([]),
        reviewers: z.array(z.object({
          id: z.string(),
          name: z.string(),
          image: z.string().optional(),
          linkedin: z.string().optional(),
          x: z.string().optional(),
          github: z.string().optional(),
          jobTitle: z.string().optional(),
          bio: z.string().optional(),
        })).optional().default([]),
      }),
    }),
  },
})
