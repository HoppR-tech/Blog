<script lang="ts" setup>
import { useAbsoluteUrl } from '@/composables/useAbsoluteUrl'
import { usePageSeo } from '@/composables/usePageSeo'
import { buildOrganizationJsonLd } from '@/utils/organization'

const baseUrl = useAbsoluteUrl('/')
const trimmedBase = baseUrl.replace(/\/$/, '')

usePageSeo({
  title: 'Software Craftsmanship, Cloud & Architecture',
  description: 'Bienvenue sur le Blog Tech d\'HoppR. Partage, veille et ressources de la communauté sur les thématiques du Software Craftsmanship, du Cloud, de l\'architecture et de la Tech en générale.',
  url: '/',
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationJsonLd(trimmedBase),
      {
        '@type': 'WebSite',
        '@id': `${trimmedBase}/#website`,
        'name': 'Blog HoppR',
        'url': trimmedBase,
        'description': 'Partage, veille et ressources de la communauté sur les thématiques du Software Craftsmanship, du Cloud, de l\'architecture et de la Tech en générale.',
        'inLanguage': 'fr-FR',
        'publisher': { '@id': 'https://hoppr.tech/#organization' },
      },
    ],
  },
})

// Generate OG Image
defineOgImageComponent('About', {
  headline: 'Bienvenue 👋',
  mainTitle: 'Blog Hoppr Tech',
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
