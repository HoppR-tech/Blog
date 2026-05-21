<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAbsoluteUrl } from '@/composables/useAbsoluteUrl'
import { usePageSeo } from '@/composables/usePageSeo'
import { aggregateAuthors, buildProfilePageJsonLd } from '@/utils/authorsAggregation'
import { resolveContentAsset } from '@/utils/contentAssets'
import { wrapInGraph } from '@/utils/organization'

const route = useRoute()
const baseUrl = useAbsoluteUrl('/')

const slug = computed(() => {
  const raw = route.params.slug
  return typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : ''
})

const { data: articles } = await useAsyncData(`author-${slug.value}-articles`, () =>
  queryCollection('blogs')
    .order('date', 'DESC')
    .all())

const author = computed(() => {
  const rawArticles = (articles.value ?? []).map(a => ({
    path: a.path,
    title: a.title,
    date: a.date,
    image: a.image,
    description: a.description,
    tags: a.tags,
    authors: a.authors,
  }))
  const aggregated = aggregateAuthors(rawArticles as any)
  return aggregated.find(a => a.slug === slug.value) ?? null
})

if (!author.value) {
  // 404 if the slug doesn't match any known author.
  throw createError({ statusCode: 404, statusMessage: 'Auteur·rice introuvable', fatal: true })
}

const authorImage = computed(() => {
  if (!author.value || !author.value.image)
    return undefined
  const firstArticlePath = author.value.articles[0]?.path
  if (author.value.image.startsWith('http'))
    return author.value.image
  return firstArticlePath
    ? resolveContentAsset(author.value.image, firstArticlePath)
    : author.value.image
})

// Format article props pour BlogCard (cohérence avec /blogs, /categories, /tags).
// Réutilisation du composant BlogCard plutôt qu'une mini-card custom : Jakob's
// Law (l'utilisateur reconnaît le pattern partout sur le site). Grid 2 colonnes
// pour réduire la verticalité quand l'auteur·rice a ~10 articles.
const articleCards = computed(() =>
  (author.value?.articles ?? []).map((a) => {
    const resolved = a.image ? resolveContentAsset(a.image, a.path) : '/not-found.jpg'
    return {
      path: a.path,
      title: a.title || '',
      date: a.date ? formatDate(a.date) : '',
      description: a.description || '',
      image: resolved,
      alt: a.title || '',
      ogImage: resolved,
      tags: a.tags || [],
      published: true,
    }
  }),
)

const profileUrl = computed(() => `/auteurs/${slug.value}`)
const sameAs = computed(() =>
  author.value
    ? [author.value.linkedin, author.value.x, author.value.github].filter(
        (s): s is string => typeof s === 'string' && s.length > 0,
      )
    : [],
)

const seoDescription = computed(() => {
  if (!author.value)
    return ''
  if (author.value.bio)
    return author.value.bio.slice(0, 160)
  const titles = author.value.articles.slice(0, 3).map(a => a.title).filter(Boolean).join(' · ')
  const role = author.value.jobTitle || author.value.primaryCategory || 'consultant·e HoppR'
  return `${author.value.name} — ${role} chez HoppR. ${author.value.articleCount} article·s publié·s sur le blog. ${titles ? `Récents : ${titles}` : ''}`.slice(0, 160)
})

usePageSeo({
  title: author.value.name,
  description: seoDescription.value,
  url: profileUrl.value,
  image: authorImage.value,
  type: 'profile',
  jsonLd: wrapInGraph(
    baseUrl,
    buildProfilePageJsonLd({ baseUrl, author: author.value }),
  ),
})

defineOgImageComponent('About', {
  headline: author.value.jobTitle || author.value.primaryCategory || 'Auteur·rice HoppR',
  mainTitle: author.value.name,
  description: seoDescription.value,
  imageTop: '/images/og-post.png',
  imageBottom: '/images/og-home.png',
})
</script>

<template>
  <main class="container max-w-4xl mx-auto px-4 sm:px-6 py-8 text-zinc-700 dark:text-zinc-300">
    <BlogBreadcrumb
      v-if="author"
      :title="author.name"
      :path="profileUrl"
      :custom-items="[{ name: 'Auteur·rices', url: '/auteurs' }, { name: author.name, url: profileUrl }]"
    />

    <header v-if="author" class="flex flex-col sm:flex-row items-start gap-6 mb-10">
      <img
        v-if="authorImage"
        :src="authorImage"
        :alt="`Photo de ${author.name}`"
        class="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-hoppr-green shrink-0"
        width="160"
        height="160"
      >
      <div
        v-else
        class="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-hoppr-purple/10 flex items-center justify-center text-5xl text-hoppr-purple shrink-0"
      >
        {{ author.name.charAt(0) }}
      </div>

      <div class="flex-1 min-w-0">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-hoppr-purple dark:text-zinc-100 mb-2">
          {{ author.name }}
        </h1>
        <p v-if="author.jobTitle" class="text-lg text-zinc-700 dark:text-zinc-300 mb-3">
          {{ author.jobTitle }}
        </p>

        <p v-if="author.bio" class="text-base text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed">
          {{ author.bio }}
        </p>

        <ul v-if="sameAs.length > 0" class="flex flex-wrap gap-3 mb-3">
          <li v-if="author.linkedin">
            <a
              :href="author.linkedin"
              rel="me noopener"
              target="_blank"
              class="inline-flex items-center gap-1 text-sm text-hoppr-purple dark:text-hoppr-green hover:underline"
            >
              <Icon name="mdi:linkedin" size="20" />
              LinkedIn
            </a>
          </li>
          <li v-if="author.x">
            <a
              :href="author.x"
              rel="me noopener"
              target="_blank"
              class="inline-flex items-center gap-1 text-sm text-hoppr-purple dark:text-hoppr-green hover:underline"
            >
              <Icon name="mdi:twitter" size="20" />
              X / Twitter
            </a>
          </li>
          <li v-if="author.github">
            <a
              :href="author.github"
              rel="me noopener"
              target="_blank"
              class="inline-flex items-center gap-1 text-sm text-hoppr-purple dark:text-hoppr-green hover:underline"
            >
              <Icon name="mdi:github" size="20" />
              GitHub
            </a>
          </li>
        </ul>

        <div v-if="author.categories.length > 0" class="mb-3">
          <p class="text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-200 font-semibold mb-2">
            Catégories
          </p>
          <ul class="flex flex-wrap gap-2">
            <li v-for="cat in author.categories" :key="cat.value">
              <NuxtLink
                :to="`/categories/${cat.value}`"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-hoppr-purple/10 dark:bg-hoppr-purple/20 text-hoppr-purple dark:text-hoppr-green border border-hoppr-purple/20 dark:border-hoppr-green/30 hover:bg-hoppr-purple/20 dark:hover:bg-hoppr-green/10 transition-colors"
              >
                <Icon :name="cat.icon" size="16" aria-hidden="true" />
                <span class="font-semibold">{{ cat.label }}</span>
                <span class="text-xs opacity-75">· {{ cat.count }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div v-if="author.knowsAbout.length > 0" class="mb-2">
          <p class="text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-200 font-semibold mb-2">
            Sujets
          </p>
          <ul class="flex flex-wrap gap-2">
            <li
              v-for="topic in author.knowsAbout"
              :key="topic"
              class="px-2 py-1 text-xs rounded bg-hoppr-green/10 text-hoppr-purple dark:text-hoppr-green"
            >
              {{ topic }}
            </li>
          </ul>
        </div>

        <p class="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          {{ author.articleCount }} article{{ author.articleCount > 1 ? 's' : '' }} publié{{ author.articleCount > 1 ? 's' : '' }}
        </p>
      </div>
    </header>

    <h2 class="text-2xl font-bold text-hoppr-purple dark:text-zinc-100 mb-6 pl-4 border-l-4 border-hoppr-green">
      Articles
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <BlogCard
        v-for="article in articleCards"
        :key="article.path"
        v-bind="article"
      />
    </div>
  </main>
</template>
