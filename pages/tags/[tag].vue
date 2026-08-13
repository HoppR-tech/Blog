<script lang="ts" setup>
import { usePageSeo } from '@/composables/usePageSeo'
import { buildPaginationHeadLinks, resolvePageNumber } from '@/utils/pagination'
import { capitalize } from '@/utils/stringUtils'

definePageMeta({
  key: route => route.path,
})

const route = useRoute()
const router = useRouter()

const routeTag = route.params.tag
const tag = (Array.isArray(routeTag) ? routeTag.at(0) : routeTag)?.toLowerCase() || ''

const MIN_ARTICLES_FOR_INDEX = 3

const { data, error } = await useAsyncData(`tag-data-${tag}`, async () => {
  const allPosts = await queryCollection('blogs').order('date', 'DESC').all()
  return allPosts.filter(article =>
    article.published === true
    && article.tags?.some(articleTag => articleTag.toLowerCase() === tag),
  )
})

if (error.value) {
  throw createError({
    status: 500,
    statusText: 'Impossible de charger ce tag',
    cause: error.value,
    fatal: true,
  })
}

if (!tag || !data.value || data.value.length === 0) {
  throw createError({
    status: 404,
    statusText: 'Tag introuvable',
    fatal: true,
  })
}

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
      statusText: 'Page de tag introuvable',
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
    path: `/tags/${tag}`,
    query: { ...(page > 1 && { page: String(page) }) },
  })
}

const shouldNoindex = computed(() => (data.value?.length || 0) < MIN_ARTICLES_FOR_INDEX)

const canonicalUrl = computed(() => {
  const base = `/tags/${tag}`
  return pageNumber.value > 1 ? `${base}?page=${pageNumber.value}` : base
})

const prevNextLinks = computed(() => {
  return buildPaginationHeadLinks(`/tags/${tag}`, pageNumber.value, totalPages.value)
})

const MAX_RECENT_TITLES_IN_DESCRIPTION = 3
const MAX_TITLE_CHARS = 40

const tagLabel = capitalize(tag)

const seoDescription = computed(() => {
  const count = data.value?.length ?? 0

  if (count === 0)
    return `Articles HoppR tagués "${tag}" — Software Craftsmanship, Cloud et Architecture par l'équipe tech HoppR.`

  const recentTitles = (data.value ?? [])
    .slice(0, MAX_RECENT_TITLES_IN_DESCRIPTION)
    .map((a) => {
      const t = (a.title as string | undefined) ?? ''
      return t.length > MAX_TITLE_CHARS ? `${t.slice(0, MAX_TITLE_CHARS - 1)}…` : t
    })
    .filter((t): t is string => t.length > 0)

  const titlesPart = recentTitles.length > 0 ? ` Récents : ${recentTitles.join(' · ')}.` : ''
  return `${count} article${count > 1 ? 's' : ''} HoppR tagué${count > 1 ? 's' : ''} "${tag}".${titlesPart}`
})

usePageSeo({
  title: tagLabel,
  description: seoDescription,
  url: canonicalUrl,
  noindex: shouldNoindex,
})

useHead(() => ({
  link: prevNextLinks.value,
}))

// Generate OG Image — defineOgImageComponent + nom de composant explicite,
// sinon unhead plante "originalName.split is not a function" → 500 SSR.
defineOgImageComponent('About', {
  title: tagLabel,
  description: seoDescription.value,
})
</script>

<template>
  <main class="container max-w-6xl mx-auto text-zinc-600 px-4">
    <BlogBreadcrumb
      :title="capitalize(tag)"
      :path="`/tags/${tag}`"
      :custom-items="[{ name: 'Tags', url: '/tags' }, { name: capitalize(tag), url: `/tags/${tag}` }]"
    />
    <TagTopic />
    <h2 class="sr-only">
      Articles avec ce tag
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <BlogCard
        v-for="post in paginatedData"
        :key="post.title"
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
      <BlogEmpty v-if="!paginatedData || paginatedData.length === 0" />
    </div>
    <UiPagination
      v-if="totalPages > 1"
      :current-page="pageNumber"
      :total-pages="totalPages"
      :base-url="`/tags/${tag}`"
      @page-change="onPageChange"
    />
  </main>
</template>
