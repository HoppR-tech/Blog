<script lang="ts" setup>
import type { NuxtError } from 'nuxt/app'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Person } from '~/types/blog'

const route = useRoute()
const { data, error } = await useAsyncData('all-blog-post', () =>
  queryContent('/blogs')
    .sort({ date: -1 })
    .find()
    .catch((err: Error) => {
      console.error('Erreur lors de la récupération des articles:', err)
      error.value = { statusCode: 500, message: 'Impossible de charger les articles. Veuillez réessayer plus tard.' } as NuxtError
      return []
    }),
)

const elementPerPage = ref(5)
const pageNumber = ref(1)
const searchTest = ref('')
const isLoading = ref(true)

watch(() => route.query.search, (newSearch) => {
  if (newSearch) {
    searchTest.value = newSearch as string
    pageNumber.value = 1
  }
  else {
    searchTest.value = ''
  }
}, { immediate: true })

watch(data, (newData) => {
  if (newData !== undefined)
    isLoading.value = false
}, { immediate: true })

const formattedData = computed(() => {
  return data.value?.map((articles) => {
    return {
      path: articles._path,
      title: articles.title || 'no-title available',
      description: articles.description || 'no-description available',
      image: articles.image || '/not-found.jpg',
      alt: articles.alt || 'no alter data available',
      ogImage: articles.ogImage || '/not-found.jpg',
      date: formatDate(articles.date) || 'not-date-available',
      tags: articles.tags || [],
      published: articles.published || false,
      content: articles.content || '',
      authors: articles.authors || [],
    }
  })
})

const searchData = computed(() => {
  if (!searchTest.value)
    return formattedData.value
  return formattedData.value?.filter((data) => {
    const lowerTitle = data.title.toLowerCase()
    const lowerDescription = data.description.toLowerCase()
    const lowerContent = data.content.toLowerCase()
    const lowerTags = data.tags.map((tag: string) => tag.toLowerCase())
    const lowerAuthors = data.authors.map((author: Person) => author.name.toLowerCase())
    const lowerSearchTerm = searchTest.value.toLowerCase()
    return lowerTitle.includes(lowerSearchTerm)
      || lowerDescription.includes(lowerSearchTerm)
      || lowerContent.includes(lowerSearchTerm)
      || lowerTags.some((tag: string | string[]) => tag.includes(lowerSearchTerm))
      || lowerAuthors.some((author: string) => author.includes(lowerSearchTerm))
  })
})

const paginatedData = computed(() => {
  return searchData.value?.filter((data, idx) => {
    const startInd = ((pageNumber.value - 1) * elementPerPage.value)
    const endInd = (pageNumber.value * elementPerPage.value) - 1

    if (idx >= startInd && idx <= endInd)
      return true
    else return false
  }) || []
})

function onPreviousPageClick() {
  if (pageNumber.value > 1)
    pageNumber.value -= 1
}

const totalPage = computed(() => {
  const ttlContent = searchData.value?.length || 0
  const totalPage = Math.ceil(ttlContent / elementPerPage.value)
  return totalPage
})

function onNextPageClick() {
  if (pageNumber.value < totalPage.value)
    pageNumber.value += 1
}

useHead({
  title: 'Articles',
  meta: [
    {
      name: 'description',
      content: 'Toutes les publications sur le blog d\'HoppR sont ici.',
    },
  ],
  titleTemplate: 'Blog HoppR - %s',
})

// Generate OG Image
const siteData = useSiteConfig()
defineOgImage({
  props: {
    title: 'Articles',
    description: 'Toutes les publications sur le blog d\'HoppR sont ici.',
    siteName: siteData.url,
  },
})
</script>

<template>
  <main class="container max-w-6xl mx-auto text-zinc-600">
    <ArchiveHero />

    <div v-if="error" class="px-6 py-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>

    <div class="px-6">
      <label for="search-input" class="sr-only">Rechercher un article</label>
      <input
        id="search-input" v-model="searchTest" placeholder="Rechercher par titre, contenu, tag ou auteur..."
        type="text"
        class="block w-full bg-[#F1F2F4] dark:bg-slate-900 dark:placeholder-zinc-500 text-zinc-800 dark:text-zinc-300 rounded-md border-gray-300 dark:border-zinc-500 shadow-sm focus:border-hoppr-green focus:ring focus:ring-hoppr-green focus:ring-opacity-50"
      >
    </div>

    <ClientOnly>
      <div v-if="isLoading" class="space-y-5 my-5 px-4">
        <BlogLoader />
        <BlogLoader />
        <BlogLoader />
      </div>
      <div v-else-if="error" class="space-y-5 my-5 px-4">
        <p>{{ error }}</p>
      </div>
      <div v-else class="space-y-5 my-5 px-4">
        <template v-for="post in paginatedData" :key="post.title">
          <ArchiveCard
            :path="post.path" :title="post.title" :date="post.date" :description="post.description"
            :image="post.image" :alt="post.alt" :og-image="post.ogImage" :tags="post.tags"
            :published="post.published"
          />
        </template>

        <ArchiveCard v-if="paginatedData.length <= 0" title="No Post Found" image="/not-found.jpg" />
      </div>

      <template #fallback>
        <!-- this will be rendered on server side -->
        <BlogLoader />
        <BlogLoader />
        <BlogLoader />
      </template>
    </ClientOnly>

    <div class="flex justify-center items-center space-x-6 ">
      <button :disabled="pageNumber <= 1" @click="onPreviousPageClick">
        <Icon name="mdi:code-less-than" size="30" :class="{ 'text-sky-700 dark:text-sky-400': pageNumber > 1 }" />
      </button>
      <p>{{ pageNumber }} / {{ totalPage }}</p>
      <button :disabled="pageNumber >= totalPage" @click="onNextPageClick">
        <Icon
          name="mdi:code-greater-than" size="30"
          :class="{ 'text-sky-700 dark:text-sky-400': pageNumber < totalPage }"
        />
      </button>
    </div>
  </main>
</template>
