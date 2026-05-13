<script lang="ts" setup>
import { useAbsoluteUrl } from '@/composables/useAbsoluteUrl'
import { usePageSeo } from '@/composables/usePageSeo'
import { wrapInGraph } from '@/utils/organization'

const baseUrl = useAbsoluteUrl('/')
const trimmedBase = baseUrl.replace(/\/$/, '')

usePageSeo({
  title: 'Software Craftsmanship, Cloud & Architecture',
  description: 'Bienvenue sur le Blog Tech d\'HoppR. Partage, veille et ressources de la communauté sur les thématiques du Software Craftsmanship, du Cloud, de l\'architecture et de la Tech en générale.',
  url: '/',
  jsonLd: wrapInGraph(baseUrl, {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${trimmedBase}/#faq`,
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Qui est HoppR ?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'HoppR est une ESN française certifiée B Corp, présente à Paris, Lille et Lyon. L\'entreprise est spécialisée en Software Craftsmanship, Cloud et Architecture logicielle.',
        },
      },
      {
        '@type': 'Question',
        'name': 'À qui s\'adresse le blog HoppR ?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Le blog HoppR s\'adresse aux développeur·euses, architectes cloud, software crafter·euses et platform engineer·euses francophones qui veulent monter en compétence via des retours d\'expérience concrets.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Quels sujets sont couverts par le blog ?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'TDD, refactoring, DDD, clean code, BDD, architecture hexagonale, AWS, GCP, Kubernetes, Terraform, observabilité Datadog, FinOps, GreenOps, plateformes internes (IDP), patterns de résilience et bounded contexts.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Qui écrit les articles ?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Les articles sont écrits par les consultant·es HoppR à partir de leurs missions réelles : architectures mises en place, problèmes rencontrés en production, retours d\'expérience instructifs.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Le blog est-il open source ?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Oui, le code du blog HoppR est open source et disponible sur GitHub : github.com/HoppR-tech/Blog.',
        },
      },
    ],
  }),
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
