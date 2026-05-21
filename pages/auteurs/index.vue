<script lang="ts" setup>
import { computed } from 'vue'
import { useAbsoluteUrl } from '@/composables/useAbsoluteUrl'
import { usePageSeo } from '@/composables/usePageSeo'
import { aggregateAuthors } from '@/utils/authorsAggregation'
import { resolveContentAsset } from '@/utils/contentAssets'
import { wrapInGraph } from '@/utils/organization'

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
  description: `${authors.value.length} voix derrière le blog HoppR. Une équipe tech qui partage ses retours d'expérience — du software craft au platform engineering, en passant par le cloud et l'architecture — depuis Paris, Lille et Lyon.`,
  url: '/auteurs',
  jsonLd: wrapInGraph(baseUrl, {
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
  }),
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

    <!--
      Hero 2 colonnes (texte gauche, image blog droite) — pattern identique
      à archive/hero.vue, category/hero.vue, tag/hero.vue, main/hero.vue.
      Cohérence visuelle entre les pages d'entrée du blog.
    -->
    <div class="grid grid-cols-1 sm:grid-cols-2 items-center gap-6 mb-10">
      <div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-hoppr-purple dark:text-zinc-100 mb-4">
          L'équipe HoppR
        </h1>
        <p class="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <strong>{{ authors.length }} voix</strong> derrière le blog HoppR.
          Une équipe tech qui partage ses retours d'expérience — du software craft
          au platform engineering, en passant par le cloud et l'architecture —
          depuis Paris, Lille et Lyon.
        </p>
      </div>
      <div class="justify-self-center mt-6 sm:mt-0">
        <LogoBlogimg
          class="w-full max-w-xs sm:max-w-full h-auto"
          alt="Image avec un lego et un mur écrit blog derrière"
        />
      </div>
    </div>

    <div
      v-if="authorsWithResolvedImage.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <NuxtLink
        v-for="author in authorsWithResolvedImage"
        :key="author.notionId"
        :to="`/auteurs/${author.slug}`"
        class="group block border dark:border-zinc-500 overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 bg-white dark:bg-slate-900 text-zinc-700 dark:text-zinc-300"
      >
        <div class="flex items-center gap-4 mb-3">
          <img
            v-if="author.resolvedImage"
            :src="author.resolvedImage"
            :alt="`Photo de ${author.name}`"
            class="w-16 h-16 rounded-full object-cover border-2 border-hoppr-green shrink-0"
            width="64"
            height="64"
            loading="lazy"
          >
          <div
            v-else
            class="w-16 h-16 rounded-full bg-hoppr-purple/10 flex items-center justify-center text-2xl text-hoppr-purple shrink-0"
          >
            {{ author.name.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-bold text-black dark:text-zinc-100 group-hover:text-hoppr-green transition-colors truncate">
              {{ author.name }}
            </h2>
            <p v-if="author.jobTitle" class="text-sm text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
              {{ author.jobTitle }}
            </p>
          </div>
        </div>
        <!--
          Catégorie principale uniquement (Hick's Law) : afficher 2 badges
          sur une grille de 15 cartes crée 30 badges simultanés, donc du
          bruit de scan plutôt qu'un signal. Le détail des catégories est
          sur la page individuelle.
        -->
        <p v-if="author.categories.length > 0" class="mb-2">
          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-hoppr-purple/10 dark:bg-hoppr-purple/20 text-hoppr-purple dark:text-hoppr-green"
          >
            <Icon :name="author.categories[0]!.icon" size="12" aria-hidden="true" />
            {{ author.categories[0]!.label }}
          </span>
        </p>
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
