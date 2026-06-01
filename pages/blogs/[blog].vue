<script setup lang="ts">
import type { Person } from '@/types/blog'
import ContactCTA from '@/components/blog/ContactCTA.vue'
import { useAbsoluteUrl } from '@/composables/useAbsoluteUrl'
import { usePageSeo } from '@/composables/usePageSeo'
import { extractHowToSteps } from '@/utils/articleEnrichment'
import { buildBlogPostingJsonLd } from '@/utils/blogPostingJsonLd'
import { buildFaqJsonLd, extractFaqEntries, serializeAstToMarkdownLite } from '@/utils/faqJsonLd'
import { wrapInGraph } from '@/utils/organization'
import { stripMarkdown } from '@/utils/stringUtils'

const { path } = useRoute()
const config = useRuntimeConfig()
const baseUrl = config.public.baseUrl as string

const { data: article, error } = await useAsyncData(`blog-post-${path}`, () => {
  return queryCollection('blogs').path(path).first()
})

if (error.value) {
  console.error('Error fetching article:', error.value)
  navigateTo('/404')
}

const blogPostProps = computed(() => {
  const articlePath = article.value?.path || path
  return {
    title: article.value?.title || 'no-title available',
    description: article.value?.description || 'no-description available',
    image: resolveContentAsset(article.value?.image || '/not-found.jpg', articlePath),
    alt: article.value?.alt || 'no alter data available',
    ogImage: resolveContentAsset(article.value?.ogImage || '/not-found.jpg', articlePath),
    date: article.value?.date || 'not-date-available',
    tags: article.value?.tags || [],
    published: article.value?.published || false,
  }
})

const articlePath = computed(() => article.value?.path || path)
const authors: Person[] = (article.value?.authors || []).map(a => ({
  notionId: a.id,
  name: a.name,
  image: resolveContentAsset(a.image || '', articlePath.value),
  linkedin: a.linkedin,
  x: a.x,
  github: (a as { github?: string }).github,
  jobTitle: (a as { jobTitle?: string }).jobTitle,
  bio: (a as { bio?: string }).bio,
}))
const reviewers: Person[] = (article.value?.reviewers || []).map(r => ({
  notionId: r.id,
  name: r.name,
  image: resolveContentAsset(r.image || '', articlePath.value),
  linkedin: r.linkedin,
  x: r.x,
  github: (r as { github?: string }).github,
  jobTitle: (r as { jobTitle?: string }).jobTitle,
  bio: (r as { bio?: string }).bio,
}))
const ogDescription = computed(() => stripMarkdown(blogPostProps.value.description))

const absoluteImage = computed(() => useAbsoluteUrl(blogPostProps.value.ogImage || blogPostProps.value.image))

const articleDateModified = computed(() => {
  const updated = (article.value as { lastEditedTime?: string, updatedAt?: string } | undefined)?.lastEditedTime
    || (article.value as { updatedAt?: string } | undefined)?.updatedAt
  return typeof updated === 'string' && updated.length > 0 ? updated : blogPostProps.value.date
})

const articleBody = computed(() => {
  return (article.value as { body?: unknown } | undefined)?.body
})

const articleRawBody = computed(() => {
  const a = article.value as { rawbody?: string } | undefined
  if (typeof a?.rawbody === 'string' && a.rawbody.length > 0)
    return a.rawbody
  // Nuxt Content v3 exposes the parsed MDC AST on `body`. Re-serialize it
  // into a markdown-lite string the FAQ extractor can consume.
  const serialized = serializeAstToMarkdownLite(articleBody.value as Parameters<typeof serializeAstToMarkdownLite>[0])
  return serialized.length > 0 ? serialized : undefined
})

const structuredData = computed(() => buildBlogPostingJsonLd({
  baseUrl,
  path: articlePath.value,
  title: blogPostProps.value.title,
  description: ogDescription.value,
  image: absoluteImage.value,
  datePublished: blogPostProps.value.date,
  dateModified: articleDateModified.value,
  tags: blogPostProps.value.tags,
  authors,
  rawBody: articleRawBody.value,
  body: articleBody.value,
}))

usePageSeo({
  title: blogPostProps.value.title || '',
  description: ogDescription.value,
  url: path,
  image: blogPostProps.value.ogImage || blogPostProps.value.image,
  type: 'article',
  publishedTime: blogPostProps.value.date,
  modifiedTime: articleDateModified.value,
  authors: authors.map(a => a.name),
  jsonLd: wrapInGraph(baseUrl, structuredData.value),
})

// `articleRawBody` is computed from `article.value` which is resolved at SSR
// (await useAsyncData above). Evaluate synchronously here so the head is
// emitted in the initial server-rendered HTML, not deferred to client hydration.
const faqJsonLdValue = buildFaqJsonLd(extractFaqEntries(articleRawBody.value))
const howToJsonLdValue = extractHowToSteps(articleBody.value, blogPostProps.value.title)

const extraJsonLdScripts = [
  ...(faqJsonLdValue ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(faqJsonLdValue) }] : []),
  ...(howToJsonLdValue ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(howToJsonLdValue) }] : []),
]

if (extraJsonLdScripts.length > 0) {
  useHead({
    script: extraJsonLdScripts,
  })
}

// Generate OG Image
defineOgImageComponent('About', {
  headline: 'Bienvenue 👋',
  mainTitle: blogPostProps.value.title || '',
  description: ogDescription.value || '',
  imageTop: '/images/og-post.png',
  imageBottom: '/images/og-home.png',
})

// Load KaTeX CSS only when the article contains math formulas
onMounted(() => {
  if (document.querySelector('.katex, .katex-display')) {
    import('katex/dist/katex.min.css')
  }
})
</script>

<template>
  <div>
    <BlogReadingProgress />
    <div class="px-4 sm:px-6 max-w-6xl mx-auto lg:grid lg:grid-cols-12 lg:gap-x-12">
      <!--
        overflow-x-clip (et NON overflow-x-hidden) : par spec CSS, dès qu'un
        axe est en `hidden`, l'autre passe de `visible` à `auto` → l'élément
        devient un scroll container vertical. Sur iOS Safari ça créait un
        scroll trap qui coupait le rendu visible de l'article mobile.
        `clip` découpe sans créer de scroll container (Tailwind 3.1+).
      -->
      <div class="col-span-12 lg:col-span-9 min-w-0 w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] lg:w-auto overflow-x-clip">
        <BlogBreadcrumb
          :title="blogPostProps.title"
          :path="path"
          :tags="blogPostProps.tags"
        />
        <BlogHeader
          :title="blogPostProps.title"
          :image="blogPostProps.image"
          :alt="blogPostProps.alt"
          :date="blogPostProps.date"
          :description="blogPostProps.description"
          :tags="blogPostProps.tags"
          :authors="authors"
          :reviewers="reviewers"
        />
        <div
          class="prose prose-pre:max-w-full prose-sm sm:prose-base lg:prose-lg w-full break-words [overflow-wrap:anywhere]
            prose-h2:text-2xl sm:prose-h2:text-3xl lg:prose-h2:text-4xl prose-h2:font-bold prose-h2:text-hoppr-purple dark:prose-h2:text-zinc-100 prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-0 prose-h2:border-l-4 prose-h2:border-hoppr-green prose-h2:pl-4 prose-h2:border-t-0 prose-h2:border-r-0 prose-h2:border-b-0
            prose-h3:text-xl sm:prose-h3:text-2xl lg:prose-h3:text-3xl prose-h3:border-l-[3px] prose-h3:border-hoppr-green prose-h3:pl-3 prose-h3:not-italic prose-h3:text-zinc-800 dark:prose-h3:text-zinc-200 prose-h3:mt-8 prose-h3:mb-3
            prose-h4:text-lg sm:prose-h4:text-xl lg:prose-h4:text-2xl prose-h4:not-italic prose-h4:text-zinc-700 dark:prose-h4:text-zinc-300 prose-h4:mt-6 prose-h4:mb-2 prose-h4:border-l-2 prose-h4:border-hoppr-green/40 prose-h4:pl-3
            prose-p:text-base lg:prose-p:text-lg prose-p:leading-relaxed
            max-w-full mx-auto prose-zinc dark:prose-invert prose-img:rounded-lg prose-img:max-w-full
            prose-headings:font-bold
            prose-a:text-hoppr-purple dark:prose-a:text-hoppr-green prose-a:no-underline prose-a:border-b prose-a:border-hoppr-green prose-a:border-opacity-50 hover:prose-a:border-opacity-100 hover:prose-a:text-hoppr-green hover:prose-a:bg-hoppr-green hover:prose-a:bg-opacity-10 transition-all duration-300
            prose-hr:border-zinc-200 dark:prose-hr:border-zinc-700 prose-hr:my-8
            prose-table:border-collapse prose-table:w-full prose-table:rounded-lg prose-table:overflow-hidden prose-table:border-0 prose-table:mt-6 [&_table]:block [&_table]:overflow-x-auto
            prose-th:bg-hoppr-purple prose-th:text-white prose-th:dark:bg-hoppr-purple/80 prose-th:p-2.5 sm:prose-th:p-3 prose-th:border-0 prose-th:border-b-2 prose-th:border-hoppr-green prose-th:text-sm sm:prose-th:text-base prose-th:font-semibold prose-th:text-left
            prose-td:p-2.5 sm:prose-td:p-3 prose-td:border-0 prose-td:border-b prose-td:border-gray-200 prose-td:dark:border-zinc-700 prose-td:text-sm sm:prose-td:text-base
            [&_tbody_tr]:bg-white [&_tbody_tr:nth-child(even)]:bg-gray-50 [&_tbody_tr]:dark:bg-zinc-800/50 [&_tbody_tr:nth-child(even)]:dark:bg-zinc-800 [&_tbody_tr:hover]:bg-hoppr-green/5 [&_tbody_tr:hover]:dark:bg-hoppr-green/10 [&_tbody_tr]:transition-colors
            prose-li:marker:text-hoppr-green
            prose-blockquote:border-l-hoppr-green prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-zinc-800/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:pr-4 prose-blockquote:text-zinc-700 dark:prose-blockquote:text-zinc-200
            prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100
            [&_.katex]:overflow-x-auto [&_.katex]:max-w-[calc(100%-1rem)]"
        >
          <ContentRenderer v-if="article" :value="article" class="article-section">
            <template #empty>
              <p>No content found.</p>
            </template>
          </ContentRenderer>
        </div>
        <BlogFooter :authors="authors" />
        <BlogRelatedPosts
          :current-path="path"
          :current-tags="blogPostProps.tags"
        />
      </div>
      <BlogToc />
    </div>
    <!--
      ClientOnly pour TocMobile : on évite que `await queryCollection` au top-level
      du composant fasse planter le SSR de la page article si la query SQLite
      jette (ce qui a probablement causé un 500 transient en prod 2026-05-14 21:35).
      Le drawer mobile est de toute façon une couche d'interaction post-mount.
    -->
    <ClientOnly>
      <BlogTocMobile />
    </ClientOnly>
    <BlogNewsletterCTA />
    <ContactCTA
      :article-title="blogPostProps.title"
      :article-link="path"
      :authors="authors.map(author => ({ name: author.name, id: author.notionId }))"
      :published-date="blogPostProps.date"
    />
  </div>
</template>
