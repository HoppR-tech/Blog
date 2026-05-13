<script lang="ts" setup>
import { useAbsoluteUrl } from '@/composables/useAbsoluteUrl'
import { usePageSeo } from '@/composables/usePageSeo'
import { categories } from '@/utils/categories'
import { wrapInGraph } from '@/utils/organization'

const route = useRoute()
const router = useRouter()
const categoryValue = computed(() => route.params.category as string)

const category = computed(() => {
  return categories.find(cat => cat.value === categoryValue.value) || {
    label: categoryValue.value,
    icon: 'mdi:tag',
    colors: { light: '#3b82f6', dark: '#60A5FA' },
    seoDescription: `Articles HoppR dans la catégorie ${categoryValue.value}.`,
  }
})

const { data } = await useAsyncData(`category-${categoryValue.value}`, async () => {
  const allPosts = await queryCollection('blogs').all()
  return allPosts.filter(article => article.tags?.includes(categoryValue.value))
})

// Pillar editorial : charge le contenu /content/categories/<slug>.md s'il existe.
// Pas bloquant : si pas de fichier, on tombe juste sur la grille sans intro.
const { data: editorial } = await useAsyncData(`category-editorial-${categoryValue.value}`, () =>
  queryCollection('categories').path(`/categories/${categoryValue.value}`).first())

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

const pageNumber = computed(() => {
  const p = Number(route.query.page)
  return (Number.isFinite(p) && p >= 1) ? p : 1
})

const paginatedData = computed(() => {
  return formattedData.value?.filter((_data, idx) => {
    const startInd = ((pageNumber.value - 1) * elementPerPage)
    const endInd = (pageNumber.value * elementPerPage) - 1
    return idx >= startInd && idx <= endInd
  }) || []
})

const totalPages = computed(() => {
  const ttlContent = formattedData.value?.length || 0
  return Math.ceil(ttlContent / elementPerPage)
})

function onPageChange(page: number) {
  router.push({
    path: `/categories/${categoryValue.value}`,
    query: { ...(page > 1 && { page: String(page) }) },
  })
}

const canonicalUrl = computed(() => {
  const base = `/categories/${categoryValue.value}`
  return pageNumber.value > 1 ? `${base}?page=${pageNumber.value}` : base
})

const prevNextLinks = computed(() => {
  const base = `/categories/${categoryValue.value}`
  const links: Array<{ rel: string, href: string }> = []
  if (pageNumber.value > 1) {
    const prevPage = pageNumber.value === 2 ? base : `${base}?page=${pageNumber.value - 1}`
    links.push({ rel: 'prev', href: prevPage })
  }
  if (pageNumber.value < totalPages.value) {
    links.push({ rel: 'next', href: `${base}?page=${pageNumber.value + 1}` })
  }
  return links
})

const seoDescription = computed(() => {
  const base = category.value.seoDescription
  const count = formattedData.value?.length ?? 0
  return count > 0 ? `${base} ${count} articles publiés.` : base
})

const categoryBaseUrl = useAbsoluteUrl('/')
const categoryTrimmedBase = categoryBaseUrl.replace(/\/$/, '')

usePageSeo({
  title: `Articles ${category.value.label}`,
  description: seoDescription.value,
  url: canonicalUrl.value,
  jsonLd: wrapInGraph(categoryBaseUrl, {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${categoryTrimmedBase}/categories/${categoryValue.value}#collectionpage`,
    'url': `${categoryTrimmedBase}/categories/${categoryValue.value}`,
    'name': `Catégorie : ${category.value.label}`,
    'description': seoDescription.value,
    'inLanguage': 'fr-FR',
    'isPartOf': { '@id': `${categoryTrimmedBase}/#website` },
    'about': { '@id': 'https://hoppr.tech/#organization' },
  }),
})

useHead({
  link: prevNextLinks.value,
})

// Generate OG Image
defineOgImage('About', {
  mainTitle: `Catégorie: ${category.value.label}`,
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

    <article
      v-if="editorial"
      class="prose prose-sm sm:prose-base lg:prose-lg max-w-3xl mx-auto mb-12 prose-zinc dark:prose-invert
        prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:font-bold prose-h2:text-hoppr-purple
        dark:prose-h2:text-zinc-100 prose-h2:mt-10 prose-h2:mb-4 prose-h2:pl-4
        prose-h2:border-l-4 prose-h2:border-hoppr-green
        prose-a:text-hoppr-purple dark:prose-a:text-hoppr-green
        prose-a:no-underline prose-a:border-b prose-a:border-hoppr-green prose-a:border-opacity-50
        hover:prose-a:border-opacity-100 hover:prose-a:text-hoppr-green
        prose-li:marker:text-hoppr-green
        prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100"
    >
      <ContentRenderer :value="editorial" />
    </article>

    <h2 v-if="!editorial" class="sr-only">
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
