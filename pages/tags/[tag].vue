<script lang="ts" setup>
import { usePageSeo } from '@/composables/usePageSeo'
import { capitalize } from '@/utils/stringUtils'

const route = useRoute()

const tag = computed(() => {
  const name = route.params.tag || ''
  let strName = ''

  if (Array.isArray(name))
    strName = name.at(0) || ''
  else
    strName = name
  return strName.toLowerCase()
})

const MIN_ARTICLES_FOR_INDEX = 3

const { data } = await useAsyncData(`tag-data-${tag.value}`, async () => {
  const allPosts = await queryCollection('blogs').all()
  return allPosts.filter(article => article.tags?.includes(tag.value))
})

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

const shouldNoindex = computed(() => (data.value?.length || 0) < MIN_ARTICLES_FOR_INDEX)

usePageSeo({
  title: capitalize(tag.value),
  description: `Découvrez nos articles sur le thème ${capitalize(tag.value)}.`,
  url: `/tags/${tag.value}`,
  noindex: shouldNoindex.value,
})

// Generate OG Image
const siteData = useSiteConfig()
defineOgImage({
  props: {
    title: capitalize(tag.value),
    description: `Découvrez nos articles sur le thème ${capitalize(tag.value)}.`,
    siteName: siteData.url,
  },
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <BlogCard
        v-for="post in formattedData"
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
      <BlogEmpty v-if="data?.length === 0" />
    </div>
  </main>
</template>
