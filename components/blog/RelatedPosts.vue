<script setup lang="ts">
const props = defineProps<{
  currentPath: string
  currentTags: string[]
}>()

const { data: relatedArticles } = await useAsyncData(
  `related-${props.currentPath}`,
  async () => {
    const allPosts = await queryCollection('blogs').order('date', 'DESC').all()

    const currentTags = new Set(props.currentTags.map(t => t.toLowerCase()))

    const scored = allPosts
      .filter(a => a.path !== props.currentPath)
      .map((article) => {
        const articleTags = (article.tags || []).map(t => t.toLowerCase())
        const commonTags = articleTags.filter(t => currentTags.has(t)).length
        return { article, score: commonTags }
      })
      .filter(s => s.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score)
          return b.score - a.score
        return (b.article.date || '').localeCompare(a.article.date || '')
      })
      .slice(0, 4)

    return scored.map(s => ({
      path: s.article.path,
      title: s.article.title || 'Sans titre',
      image: resolveContentAsset(s.article.image || '/not-found.jpg', s.article.path),
      date: formatDate(s.article.date) || '',
      tags: s.article.tags || [],
    }))
  },
)
</script>

<template>
  <section
    v-if="relatedArticles && relatedArticles.length > 0"
    class="mt-12 mb-8"
    aria-labelledby="related-posts-heading"
  >
    <h2
      id="related-posts-heading"
      class="text-2xl font-bold text-black dark:text-zinc-300 mb-6 border-b border-hoppr-green pb-2"
    >
      Articles connexes
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      <NuxtLink
        v-for="article in relatedArticles"
        :key="article.path"
        :to="article.path"
        class="group block border dark:border-zinc-500 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div class="relative h-28 sm:h-32 overflow-hidden">
          <img
            :src="article.image"
            :alt="`Image de l'article : ${article.title}`"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          >
        </div>
        <div class="p-3">
          <h3 class="text-sm font-semibold text-black dark:text-zinc-300 line-clamp-2 group-hover:text-hoppr-green transition-colors duration-200">
            {{ article.title }}
          </h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {{ article.date }}
          </p>
          <div class="flex flex-wrap gap-1 mt-2">
            <span
              v-for="tag in article.tags.slice(0, 2)"
              :key="tag"
              class="inline-block bg-hoppr-purple text-white rounded px-1.5 text-[0.6rem] font-bold uppercase tracking-wider"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
