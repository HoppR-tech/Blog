<script lang="ts" setup>
import { getAllViewCounts } from '~/server/services/redis/viewCounter'

// Calculer la date d'il y a 6 mois
const sixMonthsAgo = new Date()
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0]

// Récupérer tous les articles
const { data: articles } = await useAsyncData('all-posts', () =>
  queryContent('/blogs')
    .where({ published: true })
    .find()
)

// Récupérer les compteurs de vues
const { data: viewCounts } = await useAsyncData('view-counts', () =>
  getAllViewCounts()
)

// Combiner les articles avec leurs vues et trier
const formattedData = computed(() => {
  if (!articles.value || !viewCounts.value) return []

  const articlesWithViews = articles.value
    .map(article => ({
      path: article._path,
      title: article.title || 'no-title available',
      description: article.description || 'no-description available',
      image: article.image || '/not-found.jpg',
      alt: article.alt || 'no alter data available',
      ogImage: article.ogImage || '/not-found.jpg',
      date: article.date,
      formattedDate: formatDate(article.date) || 'not-date-available',
      tags: article.tags || [],
      published: article.published || false,
      views: viewCounts.value[article._path.replace('/blogs/', '')] || 0
    }))
    .sort((a, b) => b.views - a.views)

  // Filtrer les articles des 6 derniers mois
  const recentArticles = articlesWithViews
    .filter(article => article.date >= sixMonthsAgoStr)
    .slice(0, 6)

  // Si pas assez d'articles récents, compléter avec les plus vus de tous les temps
  if (recentArticles.length < 6) {
    const remainingCount = 6 - recentArticles.length
    const olderArticles = articlesWithViews
      .filter(article => !recentArticles.includes(article))
      .slice(0, remainingCount)

    return [...recentArticles, ...olderArticles]
  }

  return recentArticles
})

const imageSize = 'h-48'

useHead({
  title: 'Home',
  meta: [
    {
      name: 'description',
      content: 'Bienvenue sur le Blog Tech d\'HoppR. Partage, veille et ressources de la communauté sur les thématiques du Software Craftsmanship, du Cloud, de l\'architecture et de la Tech en générale.',
    },
  ],
  titleTemplate: 'Blog HoppR - %s',
})
</script>

<template>
  <div class="px-4">
    <div class="flex flex-row items-center space-x-3 pt-5 pb-3">
      <Icon name="mdi:trending-up" size="2em" class="text-black dark:text-zinc-300" />
      <h2 class="text-4xl font-semibold text-black dark:text-zinc-300 font-fira">
        Articles Tendances
      </h2>
    </div>
    <div class="grid grid-cols-1 gap-6">
      <template v-for="post in formattedData" :key="post.title">
        <ArchiveCard
          :path="post.path"
          :title="post.title"
          :date="post.formattedDate"
          :description="post.description"
          :image="post.image"
          :alt="post.alt"
          :og-image="post.ogImage"
          :tags="post.tags"
          :published="post.published"
          :image-size="imageSize"
        >
          <template #extra>
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Icon name="mdi:eye" />
              {{ post.views }} vue{{ post.views > 1 ? 's' : '' }}
            </div>
          </template>
        </ArchiveCard>
      </template>
      <template v-if="formattedData.length === 0">
        <BlogEmpty />
      </template>
    </div>
  </div>
</template>
