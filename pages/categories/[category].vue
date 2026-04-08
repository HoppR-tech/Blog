<script lang="ts" setup>
import { usePageSeo } from '@/composables/usePageSeo'
import { categories } from '@/utils/categories'

const route = useRoute()
const categoryValue = computed(() => route.params.category as string)

const category = computed(() => {
  return categories.find(cat => cat.value === categoryValue.value) || { label: categoryValue.value, icon: 'mdi:tag', colors: { light: '#3b82f6', dark: '#60A5FA' } }
})

const { data } = await useAsyncData(`category-${categoryValue.value}`, async () => {
  const allPosts = await queryCollection('blogs').order('date', 'DESC').all()
  return allPosts.filter(article =>
    article.tags?.map(t => t.toLowerCase()).includes(categoryValue.value.toLowerCase()),
  )
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

usePageSeo({
  title: `Articles ${category.value.label}`,
  description: `Découvrez nos articles dans la catégorie ${category.value.label}.`,
  url: `/categories/${categoryValue.value}`,
})

// Generate OG Image
const siteData = useSiteConfig()
defineOgImage({
  props: {
    title: `Catégorie: ${category.value.label}`,
    description: `Découvrez nos articles dans la catégorie ${category.value.label}.`,
    siteName: siteData.url,
  },
})
</script>

<template>
  <main class="container max-w-6xl mx-auto text-zinc-600 px-4">
    <BlogBreadcrumb
      :title="category.label"
      :path="`/categories/${categoryValue}`"
      :custom-items="[{ name: 'Catégories', url: '/categories' }, { name: category.label, url: `/categories/${categoryValue}` }]"
    />
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
