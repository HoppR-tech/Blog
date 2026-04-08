<script lang="ts" setup>
import type { NuxtError } from 'nuxt/app'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePageSeo } from '@/composables/usePageSeo'

const route = useRoute()
const router = useRouter()
const { data, error } = await useAsyncData('all-blog-post', () =>
  queryCollection('blogs')
    .order('date', 'DESC')
    .all()
    .catch((err: Error) => {
      console.error('Erreur lors de la récupération des articles:', err)
      error.value = { statusCode: 500, message: 'Impossible de charger les articles. Veuillez réessayer plus tard.' } as NuxtError
      return []
    }))

const elementPerPage = 5
const pageNumber = computed(() => {
  const p = Number(route.query.page)
  return (Number.isFinite(p) && p >= 1) ? p : 1
})
const searchTest = ref('')

watch(() => route.query.search, (newSearch) => {
  if (newSearch) {
    searchTest.value = newSearch as string
  }
  else {
    searchTest.value = ''
  }
}, { immediate: true })

const formattedData = computed(() => {
  return data.value?.map((articles) => {
    return {
      path: articles.path,
      title: articles.title || 'no-title available',
      description: articles.description || 'no-description available',
      image: resolveContentAsset(articles.image || '/not-found.jpg', articles.path),
      alt: articles.alt || 'no alter data available',
      ogImage: resolveContentAsset(articles.ogImage || '/not-found.jpg', articles.path),
      date: formatDate(articles.date) || 'not-date-available',
      tags: articles.tags || [],
      published: articles.published || false,
      content: (articles as any).rawbody || articles.description || '',
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
    const lowerAuthors = data.authors.map((author: { name: string }) => author.name.toLowerCase())
    const lowerSearchTerm = searchTest.value.toLowerCase()
    return lowerTitle.includes(lowerSearchTerm)
      || lowerDescription.includes(lowerSearchTerm)
      || lowerContent.includes(lowerSearchTerm)
      || lowerTags.some((tag: string | string[]) => tag.includes(lowerSearchTerm))
      || lowerAuthors.some((author: string) => author.includes(lowerSearchTerm))
  })
})

const paginatedData = computed(() => {
  return searchData.value?.filter((_data, idx) => {
    const startInd = ((pageNumber.value - 1) * elementPerPage)
    const endInd = (pageNumber.value * elementPerPage) - 1
    return idx >= startInd && idx <= endInd
  }) || []
})

const totalPage = computed(() => {
  const ttlContent = searchData.value?.length || 0
  return Math.ceil(ttlContent / elementPerPage)
})

function onPageChange(page: number) {
  const query: Record<string, string> = {}
  if (page > 1)
    query.page = String(page)
  if (searchTest.value)
    query.search = searchTest.value
  router.push({ path: '/blogs', query })
}

const canonicalUrl = computed(() => {
  return pageNumber.value > 1 ? `/blogs?page=${pageNumber.value}` : '/blogs'
})

const prevNextLinks = computed(() => {
  const links: Array<{ rel: string, href: string }> = []
  if (pageNumber.value > 1) {
    const prevPage = pageNumber.value === 2 ? '/blogs' : `/blogs?page=${pageNumber.value - 1}`
    links.push({ rel: 'prev', href: prevPage })
  }
  if (pageNumber.value < totalPage.value) {
    links.push({ rel: 'next', href: `/blogs?page=${pageNumber.value + 1}` })
  }
  return links
})

usePageSeo({
  title: 'Tous nos Articles',
  description: 'Toutes les publications sur le blog d\'HoppR sont ici. Découvrez nos articles sur le Software Craftsmanship, le Cloud, l\'Architecture et la Tech.',
  url: canonicalUrl.value,
})

useHead({
  link: prevNextLinks.value,
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

    <div v-if="!data" class="space-y-5 my-5 px-4">
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

    <UiPagination
      v-if="totalPage > 1"
      :current-page="pageNumber"
      :total-pages="totalPage"
      base-url="/blogs"
      @page-change="onPageChange"
    />
  </main>
</template>
