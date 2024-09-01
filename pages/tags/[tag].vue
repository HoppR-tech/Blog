<script lang="ts" setup>

const route = useRoute()

// Récupérer la catégorie depuis les paramètres de route et la convertir en minuscules
const tag = computed(() => {
  const name = route.params.tag || ''
  let strName = ''

  if (Array.isArray(name))
    strName = name.at(0) || ''
  else
    strName = name
  return strName.toLowerCase()
})

// Récupérer les articles correspondant à la catégorie
const { data } = await useAsyncData(`tag-data-${tag.value}`, () =>
  queryContent('/blogs')
    .where({ tags: { $containsAny: [tag.value] } })
    .find(),
)

// console.error('Tag:', tag.value)
// console.error('Articles trouvés:', data.value)

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
    }
  })
})

useHead({
  title: tag.value,
  meta: [
    {
      name: 'description',
      content: `Tu trouveras tous les articles en relation avec la ${tag.value}.`,
    },
  ],
  titleTemplate: 'Blog HoppR - %s',
})

// Generate OG Image
const siteData = useSiteConfig()
defineOgImage({
  props: {
    title: tag.value?.toUpperCase(),
    description: `Tu trouveras tous les articles en relation avec la ${tag.value}.`,
    siteName: siteData.url,
  },
})
</script>

<template>
  <main class="container max-w-6xl mx-auto text-zinc-600 px-4">
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
