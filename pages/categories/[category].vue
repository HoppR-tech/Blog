<script lang="ts" setup>
import { useAbsoluteUrl } from '@/composables/useAbsoluteUrl'
import { usePageSeo } from '@/composables/usePageSeo'
import { categories } from '@/utils/categories'
import { wrapInGraph } from '@/utils/organization'
import { buildPaginationHeadLinks, resolvePageNumber } from '@/utils/pagination'

definePageMeta({
  key: route => route.path,
})

const route = useRoute()
const router = useRouter()
const routeCategory = route.params.category
const categoryValue = Array.isArray(routeCategory) ? routeCategory.at(0) || '' : routeCategory || ''
const category = categories.find(cat => cat.value === categoryValue)

if (!category) {
  throw createError({
    status: 404,
    statusText: 'Catégorie introuvable',
    fatal: true,
  })
}

const { data, error } = await useAsyncData(`category-${categoryValue}`, async () => {
  const allPosts = await queryCollection('blogs').order('date', 'DESC').all()
  return allPosts.filter(article =>
    article.published === true
    && article.tags?.some(tag => tag.toLowerCase() === categoryValue.toLowerCase()),
  )
})

if (error.value) {
  throw createError({
    status: 500,
    statusText: 'Impossible de charger cette catégorie',
    cause: error.value,
    fatal: true,
  })
}

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

const elementPerPage = 12

const totalPages = computed(() => {
  const ttlContent = formattedData.value?.length || 0
  return Math.ceil(ttlContent / elementPerPage)
})

const pageNumber = computed(() => {
  const page = resolvePageNumber(route.query.page, totalPages.value)
  if (page === null) {
    throw createError({
      status: 404,
      statusText: 'Page de catégorie introuvable',
      fatal: true,
    })
  }
  return page
})

const paginatedData = computed(() => {
  return formattedData.value?.filter((_data, idx) => {
    const startInd = ((pageNumber.value - 1) * elementPerPage)
    const endInd = (pageNumber.value * elementPerPage) - 1
    return idx >= startInd && idx <= endInd
  }) || []
})

function onPageChange(page: number) {
  router.push({
    path: `/categories/${categoryValue}`,
    query: { ...(page > 1 && { page: String(page) }) },
  })
}

const canonicalUrl = computed(() => {
  const base = `/categories/${categoryValue}`
  return pageNumber.value > 1 ? `${base}?page=${pageNumber.value}` : base
})

const prevNextLinks = computed(() => {
  return buildPaginationHeadLinks(`/categories/${categoryValue}`, pageNumber.value, totalPages.value)
})

const seoDescription = computed(() => {
  const base = category.seoDescription
  const count = formattedData.value?.length ?? 0
  return count > 0 ? `${base} ${count} articles publiés.` : base
})

const categoryBaseUrl = useAbsoluteUrl('/')
const categoryTrimmedBase = categoryBaseUrl.replace(/\/$/, '')

const categoryJsonLd = computed(() => wrapInGraph(categoryBaseUrl, {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${categoryTrimmedBase}/categories/${categoryValue}#collectionpage`,
  'url': `${categoryTrimmedBase}/categories/${categoryValue}`,
  'name': `Catégorie : ${category.label}`,
  'description': seoDescription.value,
  'inLanguage': 'fr-FR',
  'isPartOf': { '@id': `${categoryTrimmedBase}/#website` },
  'about': { '@id': 'https://hoppr.tech/#organization' },
}))

usePageSeo({
  title: `Articles ${category.label}`,
  description: seoDescription,
  url: canonicalUrl,
  jsonLd: categoryJsonLd,
})

useHead(() => ({
  link: prevNextLinks.value,
}))

// Generate OG Image
defineOgImage('About', {
  mainTitle: `Catégorie: ${category.label}`,
  description: seoDescription.value,
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
    <h2 class="sr-only">
      Articles dans cette catégorie
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BlogCard
        v-for="post in paginatedData"
        :key="post.path"
        v-bind="post"
      />
      <BlogEmpty v-if="!paginatedData || paginatedData.length === 0" />
    </div>
    <UiPagination
      v-if="totalPages > 1"
      :current-page="pageNumber"
      :total-pages="totalPages"
      :base-url="`/categories/${categoryValue}`"
      @page-change="onPageChange"
    />
  </main>
</template>
