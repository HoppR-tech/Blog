<script lang="ts" setup>
import type { Post } from '~/src/domain/select-featured-articles'
import { selectFeaturedArticles } from '~/src/domain/select-featured-articles'
import { categories } from '~/utils/categories'

interface FormattedPost {
  path: string
  title: string
  description: string
  image: string
  alt: string
  ogImage: string
  date: string
  tags: string[]
  published: boolean
}

const categoryValues = categories.map(c => c.value)

const { data } = await useAsyncData('trending-post', async () => {
  const allPosts = await queryCollection('blogs')
    .order('date', 'DESC')
    .all()
  return selectFeaturedArticles(allPosts as (typeof allPosts[number] & Post)[], categoryValues)
}, { server: true })

const formattedData = computed<FormattedPost[]>(() => {
  if (!data.value)
    return []
  return data.value.map((article): FormattedPost => {
    return {
      path: article.path ?? '',
      title: article.title || 'no-title available',
      description: article.description || 'no-description available',
      image: resolveContentAsset(article.image || '/not-found.jpg', article.path ?? ''),
      alt: article.alt || 'no alter data available',
      ogImage: resolveContentAsset(article.ogImage || '/not-found.jpg', article.path ?? ''),
      date: formatDate(article.date) || 'not-date-available',
      tags: article.tags || [],
      published: article.published || false,
    }
  })
})

// SEO meta is handled by pages/index.vue via usePageSeo
</script>

<template>
  <div class="px-4">
    <div class="flex flex-row items-center space-x-3 pt-5 pb-3">
      <Icon name="mdi:star-outline" size="2em" class="text-black dark:text-zinc-300" />
      <h2 class="text-4xl font-semibold text-black dark:text-zinc-300 font-fira">
        Articles à la Une
      </h2>
    </div>
    <div class="grid grid-cols-1 gap-6">
      <template v-for="post in formattedData" :key="post.title">
        <ArchiveCard
          :path="post.path"
          :title="post.title"
          :date="post.date"
          :description="post.description"
          :image="post.image"
          :alt="post.alt"
          :og-image="post.ogImage"
          :tags="post.tags"
          :published="post.published"
        />
      </template>
      <template v-if="data?.length === 0">
        <BlogEmpty />
      </template>
    </div>
  </div>
</template>
