<script setup>
const socialLinks = [
  { url: 'https://github.com/HoppR-tech', icon: 'fa:github', label: 'Visitez notre page GitHub' },
  { url: 'https://www.linkedin.com/company/hopprtech', icon: 'fa:linkedin-square', label: 'Suivez-nous sur LinkedIn' },
  { url: 'https://twitter.com/HoppR_Tech', icon: 'fa:twitter-square', label: 'Suivez-nous sur X (anciennement Twitter)' },
  { url: 'https://hoppr.tech', icon: 'fa:globe', label: 'Visitez notre site web' },
  { url: '/rss.xml', icon: 'fa:rss', label: 'Abonnez-vous à notre flux RSS' },
]
</script>

<template>
  <div>
    <p class="text-black dark:text-zinc-300 text-xl py-1 font-semibold">
      Qui sommes-nous ?
    </p>
    <p class="py-2 dark:text-zinc-300  ">
      👉 Une Société de conseil et d'expertise avec un modèle novateur, une communauté Tech qui promeut le partage, la
      veille et fait grandir ses équipes.
    </p>
    <div class="my-3 space-x-3">
      <NuxtLink
        v-for="(link, index) in socialLinks"
        :key="index"
        :to="link.url"
        target="_blank"
        class="inline-flex items-center justify-center p-2 bg-hoppr-green text-hoppr-black font-semibold rounded-md transition-all duration-300 hover:bg-hoppr-black hover:text-hoppr-green transform hover:scale-110 dark:bg-hoppr-green dark:text-hoppr-black dark:hover:bg-zinc-200 dark:hover:text-hoppr-green"
        :aria-label="link.label"
      >
        <Icon :name="link.icon" size="1.5em" aria-hidden="true" />
      </NuxtLink>
    </div>
  </div>
</template>
