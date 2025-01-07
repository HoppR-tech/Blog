<script setup lang="ts">
import type { Person } from '@/types/blog'
import ContactCTA from '@/components/blog/ContactCTA.vue'
import { useRuntimeConfig } from '#app'

const { path } = useRoute()

const { data: article, error } = await useAsyncData(`blog-post-${path}`, () => {
  return queryContent(path).findOne()
})

if (error.value) {
  console.error('Error fetching article:', error.value)
  navigateTo('/404')
}

const blogPostProps = computed(() => {
  return {
    title: article.value?.title || 'no-title available',
    description: article.value?.description || 'no-description available',
    image: article.value?.image || '/not-found.jpg',
    alt: article.value?.alt || 'no alter data available',
    ogImage: article.value?.ogImage || '/not-found.jpg',
    date: article.value?.date || 'not-date-available',
    tags: article.value?.tags || [],
    published: article.value?.published || false,
  }
})

const authors: Person[] = article.value?.authors || []
const reviewers: Person[] = article.value?.reviewers || []

function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': blogPostProps.value.title,
    'image': blogPostProps.value.ogImage || blogPostProps.value.image,
    'datePublished': blogPostProps.value.date,
    'author': authors.map(author => ({
      '@type': 'Person',
      'name': author.name,
    })),
    'publisher': {
      '@type': 'Organization',
      'name': 'HoppR',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://blog.hoppr.tech/hoppr.png',
      },
    },
    'description': blogPostProps.value.description,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://blog.hoppr.tech/${path}`,
    },
  }
}

const config = useRuntimeConfig()

useHead({
  title: blogPostProps.value.title || '',
  meta: [
    { name: 'description', content: blogPostProps.value.description },
    { property: 'og:site_name', content: 'Blog HoppR' },
    { hid: 'og:type', property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content: `https://blog.hoppr.tech/${path}`,
    },
    {
      property: 'og:title',
      content: blogPostProps.value.title,
    },
    {
      property: 'og:description',
      content: blogPostProps.value.description,
    },
    {
      property: 'og:image',
      content: blogPostProps.value.ogImage || blogPostProps.value.image,
    },
    { name: 'twitter:site', content: '@HoppR_Tech' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:url',
      content: `https://blog.hoppr.tech/${path}`,
    },
    {
      name: 'twitter:title',
      content: blogPostProps.value.title,
    },
    {
      name: 'twitter:description',
      content: blogPostProps.value.description,
    },
    {
      name: 'twitter:image',
      content: blogPostProps.value.ogImage || blogPostProps.value.image,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://blog.hoppr.tech/${path}`,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(generateStructuredData()),
    },
  ],
})

// Generate OG Image
defineOgImageComponent('About', {
  headline: 'Bienvenue 👋',
  title: blogPostProps.value.title || '',
  description: blogPostProps.value.description || '',
  link: blogPostProps.value.ogImage ? new URL(blogPostProps.value.ogImage, config.public.baseUrl).href : '',
  imageTop: '/images/og-post.png',
  imageBottom: '/images/og-home.png',
})
</script>

<template>
  <div>
    <div class="px-6 container max-w-6xl mx-auto sm:grid grid-cols-12 gap-x-12 ">
      <div class="col-span-12 lg:col-span-9">
        <BlogHeader
          :title="blogPostProps.title" :image="blogPostProps.image" :alt="blogPostProps.alt"
          :date="blogPostProps.date" :description="blogPostProps.description" :tags="blogPostProps.tags"
          :authors="authors" :reviewers="reviewers"
        />
        <div
          class="prose prose-pre:max-w-xs sm:prose-pre:max-w-full prose-base sm:prose-base lg:prose-lg
            prose-h1:text-3xl sm:prose-h1:text-4xl lg:prose-h1:text-5xl prose-h1:font-bold prose-h1:text-hoppr-green prose-h1:mt-8 prose-h1:mb-6 prose-h1:border-b prose-h1:border-hoppr-green prose-h1:pb-2
            prose-h2:text-xl sm:prose-h2:text-2xl lg:prose-h2:text-3xl
            prose-h3:text-lg sm:prose-h3:text-xl lg:prose-h3:text-2xl
            prose-p:text-base sm:prose-p:text-base lg:prose-p:text-lg
            prose-h1:no-underline max-w-6xl mx-auto prose-zinc dark:prose-invert prose-img:rounded-lg
            prose-headings:font-bold
            prose-a:text-hoppr-green prose-a:no-underline prose-a:border-b prose-a:border-hoppr-green prose-a:border-opacity-30 hover:prose-a:border-opacity-100 hover:prose-a:bg-hoppr-green hover:prose-a:bg-opacity-10 transition-all duration-300 dark:prose-h1:border-zinc-700
            prose-h2:border-l-4 prose-h2:border-hoppr-green prose-h2:pl-2
            prose-h3:italic"
        >
          <ContentRenderer v-if="article" :value="article" class="article-section">
            <template #empty>
              <p>No content found.</p>
            </template>
          </ContentRenderer>
        </div>
        <BlogFooter :authors="authors" />
      </div>
      <BlogToc />
    </div>
    <ContactCTA
      :article-title="blogPostProps.title" :article-link="path"
      :authors="authors.map(author => ({ name: author.name, id: author.notionId }))"
      :published-date="blogPostProps.date"
    />
  </div>
</template>
