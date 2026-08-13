<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePageSeo } from '@/composables/usePageSeo'
import { buildPaginationHeadLinks, resolvePageNumber } from '@/utils/pagination'

const route = useRoute()
const router = useRouter()
const { data, error } = await useAsyncData('all-blog-post', () =>
  queryCollection('blogs')
    .order('date', 'DESC')
    .all()
    .then(articles => articles.filter(article => article.published === true)))

if (error.value) {
  throw createError({
    status: 500,
    statusText: 'Impossible de charger les articles',
    cause: error.value,
    fatal: true,
  })
}

const elementPerPage = 12
const searchTest = ref('')
const routeSearchTerm = computed(() => {
  return typeof route.query.search === 'string' ? route.query.search.trim() : ''
})

watch(() => route.query.search, (newSearch) => {
  searchTest.value = typeof newSearch === 'string' ? newSearch.trim() : ''
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

const totalPage = computed(() => {
  const ttlContent = searchData.value?.length || 0
  return Math.ceil(ttlContent / elementPerPage)
})

const routeSearchTotalPage = computed(() => {
  const term = routeSearchTerm.value.toLowerCase()
  const articles = formattedData.value || []
  const total = term
    ? articles.filter((article) => {
      return article.title.toLowerCase().includes(term)
        || article.description.toLowerCase().includes(term)
        || article.content.toLowerCase().includes(term)
        || article.tags.some((tag: string) => tag.toLowerCase().includes(term))
        || article.authors.some((author: { name: string }) => author.name.toLowerCase().includes(term))
    }).length
    : articles.length

  return Math.ceil(total / elementPerPage)
})

const pageNumber = computed(() => {
  const page = resolvePageNumber(route.query.page, routeSearchTotalPage.value)
  if (page === null) {
    throw createError({
      status: 404,
      statusText: 'Page d’articles introuvable',
      fatal: true,
    })
  }
  return page
})

const paginatedData = computed(() => {
  return searchData.value?.filter((_data, idx) => {
    const startInd = ((pageNumber.value - 1) * elementPerPage)
    const endInd = (pageNumber.value * elementPerPage) - 1
    return idx >= startInd && idx <= endInd
  }) || []
})

function onPageChange(page: number) {
  const query: Record<string, string> = {}
  if (page > 1)
    query.page = String(page)
  if (searchTest.value)
    query.search = searchTest.value
  router.push({ path: '/blogs', query })
}

const hasSearchQuery = computed(() => {
  return routeSearchTerm.value.length > 0
})

const paginationQuery = computed<Record<string, string>>(() => {
  return searchTest.value ? { search: searchTest.value } : {}
})

const canonicalUrl = computed(() => {
  if (hasSearchQuery.value)
    return '/blogs'
  return pageNumber.value > 1 ? `/blogs?page=${pageNumber.value}` : '/blogs'
})

const prevNextLinks = computed(() => {
  if (hasSearchQuery.value)
    return []
  return buildPaginationHeadLinks('/blogs', pageNumber.value, totalPage.value)
})

usePageSeo({
  title: 'Tous nos Articles',
  description: 'Toutes les publications sur le blog d\'HoppR sont ici. Découvrez nos articles sur le Software Craftsmanship, le Cloud, l\'Architecture et la Tech.',
  url: canonicalUrl,
  noindex: hasSearchQuery,
})

useHead(() => ({
  link: prevNextLinks.value,
}))

// Generate OG Image — defineOgImageComponent + nom de composant explicite,
// sinon unhead plante "originalName.split is not a function" → 500 SSR.
defineOgImageComponent('About', {
  title: 'Articles',
  description: 'Toutes les publications sur le blog d\'HoppR sont ici.',
})
</script>

<template>
  <main class="container max-w-6xl mx-auto text-zinc-600">
    <ArchiveHero />

    <div class="px-6">
      <label for="search-input" class="sr-only">Rechercher un article</label>
      <input
        id="search-input" v-model="searchTest" placeholder="Rechercher par titre, contenu, tag ou auteur..."
        type="text"
        class="block w-full bg-[#F1F2F4] dark:bg-slate-900 dark:placeholder-zinc-500 text-zinc-800 dark:text-zinc-300 rounded-md border-gray-300 dark:border-zinc-500 shadow-sm focus:border-hoppr-green focus:ring focus:ring-hoppr-green focus:ring-opacity-50"
      >
    </div>

    <h2 class="sr-only">
      Liste des articles
    </h2>

    <div v-if="!data" class="space-y-5 my-5 px-4">
      <BlogLoader />
      <BlogLoader />
      <BlogLoader />
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
      :query="paginationQuery"
      @page-change="onPageChange"
    />
  </main>
</template>
