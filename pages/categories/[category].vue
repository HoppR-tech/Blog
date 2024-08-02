<script lang="ts" setup>
const route = useRoute()

// Récupérer la catégorie depuis les paramètres de route et la convertir en minuscules
const category = computed(() => {
  const name = route.params.category || ''
  let strName = ''

  if (Array.isArray(name))
    strName = name.at(0) || ''
  else
    strName = name
  return strName.toLowerCase()
})

// Récupérer les articles correspondant à la catégorie
const { data } = await useAsyncData(`category-data-${category.value}`, () =>
  queryContent('/blogs')
    .where({ tags: { $containsAny: [category.value] } })
    .find(),
)

console.error('Category:', category.value)
console.error('Articles trouvés:', data.value)

const formattedData = computed(() => {
  return data.value?.map((articles) => {
    return {
      path: articles._path,
      title: articles.title || 'no-title available',
      description: articles.description || 'no-description available',
      image: articles.image || '/blogs-img/blog.jpg',
      alt: articles.alt || 'no alter data available',
      ogImage: articles.ogImage || '/blogs-img/blog.jpg',
      date: formatDate(articles.date) || 'not-date-available',
      tags: articles.tags || [],
      published: articles.published || false,
    }
  })
})

useHead({
  title: category.value,
  meta: [
    {
      name: 'description',
      content: `Tu trouveras tous les articles en relation avec la ${category.value}.`,
    },
  ],
  titleTemplate: 'Blog HoppR - %s',
})

// Generate OG Image
const siteData = useSiteConfig()
defineOgImage({
  props: {
    title: category.value?.toUpperCase(),
    description: `Tu trouveras tous les articles en relation avec la ${category.value}.`,
    siteName: siteData.url,
  },
})
</script>

<template>
  <main class="container max-w-5xl mx-auto text-zinc-600 px-4">
    <CategoryTopic />
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
