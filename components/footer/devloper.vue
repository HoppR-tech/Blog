<script setup>
const socialLinks = [
  { url: 'https://github.com/HoppR-tech', icon: 'fa:github', label: 'Visitez notre page GitHub' },
  { url: 'https://www.linkedin.com/company/hopprtech', icon: 'fa:linkedin-square', label: 'Suivez-nous sur LinkedIn' },
  { url: 'https://www.youtube.com/@HoppR-Tech', icon: 'fa:youtube-square', label: 'Notre chaîne YouTube' },
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

    <hr class="border-gray-300 dark:border-zinc-500 my-4">
    <p class="text-black dark:text-zinc-300 text-xl font-semibold">
      Newsletter
    </p>
    <p class="dark:text-zinc-300">
      Veille craft, cloud & archi — une fois par mois.
    </p>
    <a
      href="https://3689c672.sibforms.com/serve/MUIFANdy1i8fx29Hhd4mIYF3WHfNC5hCiZOJh_6RZJ_eNu-I5ZMIXKP-XNj2_aZMXcUrtRVsViCXljK3jqlVm_kAoM57VnZ5rL-_NEOBJAITTjSz_6eQMnnwiiUo4Ou-MIk3gAA-LUHV7mB3vHRixJK7bYYUHSkqxFfI00KEglVaLzGnexPmyPXLkZ3ZIUEnif9NNmmLQX7PEcWaTA=="
      target="_blank"
      rel="noopener"
      class="block text-center w-full border-2 border-hoppr-purple text-hoppr-purple dark:border-hoppr-green dark:text-hoppr-green p-2.5 sm:p-3 rounded-lg font-semibold mt-3 text-sm transition-all duration-300 hover:bg-hoppr-purple hover:text-white dark:hover:bg-hoppr-green dark:hover:text-hoppr-black hover:shadow-lg hover:scale-105"
    >
      Je m'abonne
    </a>
  </div>
</template>
