<script lang="ts" setup>
import { categories } from '@/utils/categories'

const route = useRoute()
const categoryValue = computed(() => route.params.category as string)

const category = computed(() => {
  return categories.find(cat => cat.value === categoryValue.value) || { label: categoryValue.value, icon: 'mdi:tag', colors: { light: '#3b82f6', dark: '#60A5FA' } }
})

const { data } = await useAsyncData(`category-${categoryValue.value}`, async () => {
  const allPosts = await queryCollection('blogs').order('date', 'DESC').all()
  return allPosts.filter(article => article.tags?.includes(categoryValue.value))
})

const formattedData = computed(() => {
  return data.value?.map((article) => {
    return {
      path: article.path || '/',
      title: article.title || 'no-title available',
      description: article.description || 'no-description available',
      image: resolveContentAsset(article.image || '/not-found.jpg', article.path || '/'),
      alt: article.alt || 'no alter data available',
      ogImage: resolveContentAsset(article.ogImage || '/not-found.jpg', article.path || '/'),
      date: formatDate(article.date) || 'not-date-available',
      tags: article.tags || [],
      published: article.published || false,
    }
  })
})

useHead({
  title: `Articles de la catégorie ${categoryValue.value}`,
  meta: [
    {
      name: 'description',
      content: `Découvrez tous nos articles dans la catégorie ${categoryValue.value}.`,
    },
  ],
  titleTemplate: 'Blog HoppR - %s',
})

// Generate OG Image
const siteData = useSiteConfig()
defineOgImage({
  props: {
    title: `Catégorie: ${categoryValue.value}`,
    description: `Découvrez tous nos articles dans la catégorie ${categoryValue.value}.`,
    siteName: siteData.url,
  },
})
</script>

<template>
  <main class="container max-w-6xl mx-auto text-zinc-600 px-4">
    <CategoryTopic :category="category.label" :icon="category.icon" />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BlogCard
        v-for="post in formattedData"
        :key="post.path"
        v-bind="post"
      />
      <BlogEmpty v-if="!formattedData || formattedData.length === 0" />
    </div>
  </main>
</template>
