<script lang="ts" setup>
import { computed } from 'vue'
import { useAbsoluteUrl } from '@/composables/useAbsoluteUrl'
import { usePageSeo } from '@/composables/usePageSeo'
import { aggregateAuthors } from '@/utils/authorsAggregation'
import { resolveContentAsset } from '@/utils/contentAssets'

const baseUrl = useAbsoluteUrl('/')
const trimmedBase = baseUrl.replace(/\/$/, '')

const { data: articles } = await useAsyncData('all-articles-for-authors', () =>
  queryCollection('blogs')
    .order('date', 'DESC')
    .all())

const authors = computed(() => {
  const rawArticles = (articles.value ?? []).map(a => ({
    path: a.path,
    title: a.title,
    date: a.date,
    image: a.image,
    description: a.description,
    tags: a.tags,
    authors: a.authors,
  }))
  return aggregateAuthors(rawArticles as any)
})

const authorsWithResolvedImage = computed(() =>
  authors.value.map(author => ({
    ...author,
    resolvedImage: author.image && author.articles[0]?.path
      ? resolveContentAsset(author.image, author.articles[0].path)
      : author.image,
  })),
)

usePageSeo({
  title: 'L\'équipe HoppR',
  description: `Découvrez les ${authors.value.length} auteur·rices du blog HoppR : développeur·euses, architectes cloud, software crafter·euses et platform engineer·euses qui partagent leurs retours d'expérience.`,
  url: '/auteurs',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${trimmedBase}/auteurs#collectionpage`,
    'url': `${trimmedBase}/auteurs`,
    'name': 'L\'équipe HoppR',
    'inLanguage': 'fr-FR',
    'isPartOf': { '@id': `${trimmedBase}/#website` },
    'about': { '@id': 'https://hoppr.tech/#organization' },
    'hasPart': authors.value.map(a => ({
      '@type': 'ProfilePage',
      '@id': `${trimmedBase}/auteurs/${a.slug}#profilepage`,
      'url': `${trimmedBase}/auteurs/${a.slug}`,
      'name': a.name,
    })),
  },
})

defineOgImageComponent('About', {
  headline: 'Auteur·rices',
  mainTitle: 'L\'équipe HoppR',
  description: 'Développeur·euses, architectes cloud, software crafter·euses et platform engineer·euses',
  imageTop: '/images/og-post.png',
  imageBottom: '/images/og-home.png',
})
</script>

<template>
  <main class="container max-w-6xl mx-auto px-4 sm:px-6 py-8 text-zinc-700 dark:text-zinc-300">
    <BlogBreadcrumb
      title="Auteur·rices"
      path="/auteurs"
      :custom-items="[{ name: 'Auteur·rices', url: '/auteurs' }]"
    />

    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-hoppr-purple dark:text-zinc-100 mb-4">
      L'équipe HoppR
    </h1>

    <p class="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 mb-10 leading-relaxed max-w-3xl">
      Les <strong>{{ authors.length }} consultant·es HoppR</strong> qui écrivent sur ce blog —
      développeur·euses, architectes cloud, software crafter·euses et platform engineer·euses,
      partageant leurs retours d'expérience depuis Paris, Lille et Lyon.
    </p>

    <div
      v-if="authorsWithResolvedImage.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <NuxtLink
        v-for="author in authorsWithResolvedImage"
        :key="author.notionId"
        :to="`/auteurs/${author.slug}`"
        class="group block bg-white dark:bg-slate-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-zinc-200 dark:border-zinc-700"
      >
        <div class="flex items-center gap-4 mb-3">
          <img
            v-if="author.resolvedImage"
            :src="author.resolvedImage"
            :alt="`Photo de ${author.name}`"
            class="w-16 h-16 rounded-full object-cover border-2 border-hoppr-green"
            width="64"
            height="64"
            loading="lazy"
          >
          <div
            v-else
            class="w-16 h-16 rounded-full bg-hoppr-purple/10 flex items-center justify-center text-2xl text-hoppr-purple"
          >
            {{ author.name.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-hoppr-green transition-colors truncate">
              {{ author.name }}
            </h2>
            <p v-if="author.jobTitle" class="text-sm text-zinc-600 dark:text-zinc-400 truncate">
              {{ author.jobTitle }}
            </p>
            <p v-else-if="author.primaryCategory" class="text-sm text-zinc-500 dark:text-zinc-500 truncate">
              {{ author.primaryCategory }}
            </p>
          </div>
        </div>
        <p class="text-sm text-zinc-600 dark:text-zinc-400">
          {{ author.articleCount }} article{{ author.articleCount > 1 ? 's' : '' }} publié{{ author.articleCount > 1 ? 's' : '' }}
        </p>
      </NuxtLink>
    </div>

    <div v-else class="py-12 text-center text-zinc-500">
      <p>Aucun·e auteur·rice trouvé·e pour le moment.</p>
    </div>
  </main>
</template>
