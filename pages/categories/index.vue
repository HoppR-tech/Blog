<script lang="ts" setup>
import { computed, ref } from 'vue'
import { defineOgImage, queryContent, useAsyncData, useHead, useSiteConfig } from '#imports'
import { categories } from '@/utils/categories'

const { data } = await useAsyncData('all-blog-post-for-tag', () => queryContent('/blogs').sort({ _id: -1 }).find())

const allTags = new Map()

data.value?.forEach((blog) => {
  const tags: Array<string> = blog.tags || []
  tags.forEach((tag) => {
    if (allTags.has(tag)) {
      const cnt = allTags.get(tag)
      allTags.set(tag, cnt + 1)
    }
    else {
      allTags.set(tag, 1)
    }
  })
})

const selectedCategory = ref('')

const filteredTags = computed(() => {
  if (!selectedCategory.value)
    return categories
  return categories.filter(category =>
    category.label.toLowerCase().includes(selectedCategory.value.toLowerCase()),
  )
})

useHead({
  title: 'Catégories',
  meta: [
    {
      name: 'description',
      content: 'Découvrez nos articles classés par catégories. Explorez nos contenus sur le Craft, le Cloud & Platform, l\'Architecture, et d\'autres sujets passionnants de la tech.',
    },
  ],
  titleTemplate: 'Blog HoppR - %s',
})

// Generate OG Image
const siteData = useSiteConfig()
defineOgImage({
  props: {
    title: 'Catégories',
    description: 'Découvrez nos articles classés par catégories. Explorez nos contenus sur le Craft, le Cloud & Platform, l\'Architecture, et d\'autres sujets passionnants de la tech.',
    siteName: siteData.url,
  },
})

function getCategoryCount(categoryValue: string): number {
  if (!data.value)
    return 0
  return data.value.filter(article => article.tags && article.tags.includes(categoryValue)).length
}
</script>

<template>
  <main class="container max-w-6xl mx-auto text-zinc-600">
    <CategoryHero />
    <div class="flex flex-wrap px-6 mt-6 gap-3">
      <CategoryCard
        v-for="(category, index) in filteredTags"
        :key="category.value"
        :title="category.label"
        :value="category.value"
        :count="getCategoryCount(category.value)"
        :index="index"
        :total-tags="filteredTags.length"
        :icon="category.icon"
        :colors="category.colors"
        class="w-full sm:w-auto tracking-wider"
      />
    </div>
  </main>
</template>
