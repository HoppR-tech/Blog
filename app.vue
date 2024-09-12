<script setup>
const description
  = 'Partage, veille et ressources de la communauté sur les thématiques du Software Craftsmanship, du Cloud, de l\'architecture et de la Tech en générale'
const ogTitle
  = 'Blog Tech HoppR'
const twitterDescription
  = 'Partage, veille et ressources de la communauté sur les thématiques du Software Craftsmanship, du Cloud, de l\'architecture et de la Tech en générale.'
const image
  = '/hoppr-white.png'
const mySite = 'https://blog.hoppr.tech/'
useHead({
  htmlAttrs: {
    lang: 'fr',
  },
  meta: [
    {
      charset: 'utf-8',
    },
    {
      name: 'description',
      content: description,
    },
    // Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
    { property: 'og:site_name', content: mySite },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },
    {
      property: 'og:url',
      content: mySite,
    },
    {
      property: 'og:title',
      content: ogTitle,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:image',
      content: image,
    },
    {
      property: 'og:image:secure_url',
      content: image.startsWith('https://') ? image : `https://${mySite.replace('https://', '')}${image}`,
    },
    // Test on: https://cards-dev.twitter.com/validator or https://socialsharepreview.com/
    { name: 'twitter:site', content: '@HoppR_Tech' },
    { name: 'twitter:creator', content: '@HoppR_Tech' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:url',
      content: mySite,
    },
    {
      name: 'twitter:title',
      content: ogTitle,
    },
    {
      name: 'twitter:description',
      content: twitterDescription,
    },
    {
      name: 'twitter:image',
      content: image,
    },
  ],
})
</script>

<template>
  <div class="bg-[#F1F2F4] dark:text-zinc-300 dark:bg-hoppr-black">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <Suspense>
        <NuxtPage />
      </Suspense>
    </NuxtLayout>
  </div>
</template>

<style media="print" onload="this.media='all'">
@import '@/assets/css/tailwind.css';

@layer base {
  ::selection {
    @apply bg-hoppr-green text-white;
  }

  body {
    font-family: 'Luciole', sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Fira Sans', sans-serif;
  }
}

@layer utilities {
  .page-enter-active,
  .page-leave-active,
  .layout-enter-active,
  .layout-leave-active {
    transition: all 0.4s;
  }

  .page-enter-from,
  .page-leave-to,
  .layout-enter-from,
  .layout-leave-to {
    opacity: 0;
    filter: blur(1rem);
  }
}

.off-screen-content {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}

html.dark {
  color-scheme: dark;
}
</style>

<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>

<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link rel="preload" as="image" href="/images/blog.webp">
