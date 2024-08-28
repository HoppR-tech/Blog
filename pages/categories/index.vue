<script lang="ts" setup>
import { makeFirstCharUpper } from '@/utils/helper'

const { data } = await useAsyncData('all-blog-post-for-category', () => queryContent('/blogs').sort({ _id: -1 }).find())

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

const searchQuery = ref('')

const filteredTags = computed(() => {
  if (!searchQuery.value)
    return allTags
  return new Map([...allTags].filter(([key]) =>
    key.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ))
})

useHead({
  title: 'Categories',
  meta: [
    {
      name: 'description',
      content:
        'Tous les sujets sur lesquels nous avons écrit un article ou sur lesquels nous allons écrire un article prochainement sont listés ci-dessous.',
    },
  ],
  titleTemplate: 'Blog HoppR - %s',
})

// Generate OG Image
const siteData = useSiteConfig()
defineOgImage({
  props: {
    title: 'Categories',
    description: 'Tous les sujets sur lesquels nous avons écrit un article ou sur lesquels nous allons écrire un article prochainement sont listés ci-dessous.',
    siteName: siteData.url,
  },
})
</script>

<template>
  <main class="container max-w-5xl mx-auto text-zinc-600">
    <CategoryHero />
    <div class="px-6 mt-8">
      <input
        v-model="searchQuery" type="text" placeholder="Rechercher une catégorie"
        class="block w-full bg-[#F1F2F4] dark:bg-slate-900 dark:placeholder-zinc-500 text-zinc-800 dark:text-zinc-300 rounded-md border-gray-300 dark:border-zinc-500 shadow-sm focus:border-hoppr-green focus:ring focus:ring-hoppr-green focus:ring-opacity-50"
      >
    </div>
    <div class="flex flex-wrap px-6 mt-6 gap-3">
      <CategoryCard
        v-for="(topic, index) in filteredTags" :key="topic[0]" :title="makeFirstCharUpper(topic[0])"
        :count="topic[1]"
        :index="index"
        :total-categories="filteredTags.size"
        class="w-full sm:w-auto tracking-wider"
      />
    </div>
  </main>
</template>
