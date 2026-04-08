<script lang="ts" setup>
import { useAbsoluteUrl } from '@/composables/useAbsoluteUrl'
import { usePageSeo } from '@/composables/usePageSeo'

const baseUrl = useAbsoluteUrl('/')

usePageSeo({
  title: 'Software Craftsmanship, Cloud & Architecture',
  description: 'Bienvenue sur le Blog Tech d\'HoppR. Partage, veille et ressources de la communauté sur les thématiques du Software Craftsmanship, du Cloud, de l\'architecture et de la Tech en générale.',
  url: '/',
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        'name': 'HoppR',
        'url': 'https://hoppr.tech',
        'logo': `${baseUrl}hoppr.png`,
        'sameAs': [
          'https://github.com/HoppR-tech',
          'https://www.linkedin.com/company/hopprtech',
          'https://twitter.com/HoppR_Tech',
        ],
      },
      {
        '@type': 'WebSite',
        'name': 'Blog HoppR',
        'url': baseUrl.replace(/\/$/, ''),
        'description': 'Partage, veille et ressources de la communauté sur les thématiques du Software Craftsmanship, du Cloud, de l\'architecture et de la Tech en générale.',
      },
    ],
  },
})

// Generate OG Image
defineOgImageComponent('About', {
  headline: 'Bienvenue 👋',
  title: 'Blog Hoppr Tech',
  description: 'Partage, veille et ressources de la communauté sur les thématiques du Software Craftsmanship, du Cloud, de l\'architecture et de la Tech en générale.',
  imageTop: '/images/og-post.png',
  imageBottom: '/images/og-home.png',
})
</script>

<template>
  <main class="container max-w-6xl mx-auto text-zinc-600">
    <MainHero />
    <MainRecent />
    <MainTrending />
  </main>
</template>
