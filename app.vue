<script setup>
const description
  = 'Partage, veille et ressources de la communauté sur les thématiques du Software Craftsmanship, du Cloud, de l\'architecture et de la Tech en générale'
const ogTitle
  = 'Blog Tech HoppR'
const twitterDescription
  = 'Partage, veille et ressources de la communauté sur les thématiques du Software Craftsmanship, du Cloud, de l\'architecture et de la Tech en générale.'
const config = useRuntimeConfig()
const mySite = config.public.baseUrl
const absoluteImage = `${mySite}/hoppr-white.png`
useHead({
  htmlAttrs: {
    lang: 'fr',
  },
  link: [
    { rel: 'alternate', type: 'application/rss+xml', title: 'Blog HoppR — Flux RSS', href: `${mySite}/rss.xml` },
    { rel: 'sitemap', type: 'application/xml', title: 'Sitemap', href: `${mySite}/sitemap.xml` },
  ],
  meta: [
    {
      charset: 'utf-8',
    },
    {
      name: 'description',
      content: description,
    },
    // Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
    { property: 'og:site_name', content: 'Blog HoppR' },
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
      content: absoluteImage,
    },
    // Twitter card metas (rendering when someone shares the URL on X/Twitter).
    // twitter:site / twitter:creator removed: HoppR does not maintain an X account.
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
      content: absoluteImage,
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
@import '@/assets/css/katex.responsive.css';

@layer base {
  ::selection {
    background-color: #00cca5; /* hoppr-green */
    color: white;
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

html.dark {
  color-scheme: dark;
}
</style>

<link rel="preload" as="font" type="font/woff2" href="/fonts/fira-sans-700.woff2" crossorigin>

<link rel="preload" as="image" href="/images/blog.webp">
