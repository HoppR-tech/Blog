<script setup lang="ts">
import type { Person } from '@/types/blog'
import ContactCTA from '@/components/blog/ContactCTA.vue'
import { useAbsoluteUrl } from '@/composables/useAbsoluteUrl'
import { usePageSeo } from '@/composables/usePageSeo'
import { stripMarkdown } from '@/utils/stringUtils'
import 'katex/dist/katex.min.css'

const { path } = useRoute()
const config = useRuntimeConfig()

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
}))
const reviewers: Person[] = (article.value?.reviewers || []).map(r => ({
  notionId: r.id,
  name: r.name,
  image: resolveContentAsset(r.image || '', articlePath.value),
  linkedin: r.linkedin,
  x: r.x,
}))
const ogDescription = computed(() => stripMarkdown(blogPostProps.value.description))

const absoluteImage = computed(() => useAbsoluteUrl(blogPostProps.value.ogImage || blogPostProps.value.image))

function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': blogPostProps.value.title,
    'image': absoluteImage.value,
    'datePublished': blogPostProps.value.date,
    'dateModified': blogPostProps.value.date,
    'inLanguage': 'fr',
    'author': authors.map(author => ({
      '@type': 'Person',
      'name': author.name,
    })),
    'publisher': {
      '@type': 'Organization',
      'name': 'HoppR',
      'logo': {
        '@type': 'ImageObject',
        'url': `${config.public.baseUrl}/hoppr.png`,
      },
    },
    'description': ogDescription.value,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${config.public.baseUrl}${path}`,
    },
  }
}

usePageSeo({
  title: blogPostProps.value.title || '',
  description: ogDescription.value,
  url: path,
  image: blogPostProps.value.ogImage || blogPostProps.value.image,
  type: 'article',
  publishedTime: blogPostProps.value.date,
  authors: authors.map(a => a.name),
  jsonLd: generateStructuredData(),
})

// Generate OG Image
defineOgImageComponent('About', {
  headline: 'Bienvenue 👋',
  title: blogPostProps.value.title || '',
  description: ogDescription.value || '',
  imageTop: '/images/og-post.png',
  imageBottom: '/images/og-home.png',
})
</script>

<template>
  <div>
    <div class="px-6 container max-w-6xl mx-auto sm:grid grid-cols-12 gap-x-12">
      <div class="col-span-12 lg:col-span-9">
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
          class="prose prose-pre:max-w-xs sm:prose-pre:max-w-full prose-base sm:prose-base lg:prose-lg
            prose-h2:text-3xl sm:prose-h2:text-4xl lg:prose-h2:text-5xl prose-h2:font-bold prose-h2:text-hoppr-green prose-h2:mt-8 prose-h2:mb-6 prose-h2:border-b prose-h2:border-hoppr-green prose-h2:pb-2
            prose-h3:text-xl sm:prose-h3:text-2xl lg:prose-h3:text-3xl prose-h3:border-l-4 prose-h3:border-hoppr-green prose-h3:pl-2
            prose-h4:text-lg sm:prose-h4:text-xl lg:prose-h4:text-2xl prose-h4:italic
            prose-p:text-base sm:prose-p:text-base lg:prose-p:text-lg
            prose-h2:no-underline max-w-6xl mx-auto prose-zinc dark:prose-invert prose-img:rounded-lg
            prose-headings:font-bold
            prose-a:text-hoppr-green prose-a:no-underline prose-a:border-b prose-a:border-hoppr-green prose-a:border-opacity-30 hover:prose-a:border-opacity-100 hover:prose-a:bg-hoppr-green hover:prose-a:bg-opacity-10 transition-all duration-300 dark:prose-h2:border-zinc-700
            prose-table:border prose-table:border-collapse prose-table:w-full
            prose-th:bg-gray-100 prose-th:dark:bg-slate-800 prose-th:p-2 prose-th:border prose-th:border-gray-300 prose-th:dark:border-zinc-600
            prose-td:p-2 prose-td:border prose-td:border-gray-300 prose-td:dark:border-zinc-600
            [&_.katex]:overflow-x-auto [&_.katex]:max-w-full"
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
    <ContactCTA
      :article-title="blogPostProps.title"
      :article-link="path"
      :authors="authors.map(author => ({ name: author.name, id: author.notionId }))"
      :published-date="blogPostProps.date"
    />
  </div>
</template>
