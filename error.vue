<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isNotFound = computed(() => props.error.statusCode === 404)

useHead(() => ({
  title: isNotFound.value ? 'Page introuvable' : 'Une erreur est survenue',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
}))

async function returnHome() {
  await clearError({ redirect: '/' })
}
</script>

<template>
  <NuxtLayout>
    <section class="container max-w-xl mx-auto px-6 py-10 text-center">
      <template v-if="isNotFound">
        <h1 class="sr-only">
          Page introuvable
        </h1>
        <Logo404 aria-hidden="true" />
        <p class="mt-6 text-lg text-zinc-700 dark:text-zinc-300">
          Cette page n’existe pas ou n’est plus disponible.
        </p>
      </template>
      <template v-else>
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Une erreur est survenue
        </h1>
        <p class="mt-4 text-zinc-700 dark:text-zinc-300">
          Le blog n’a pas pu afficher cette page.
        </p>
      </template>

      <button
        type="button"
        class="mt-8 rounded-md bg-hoppr-green px-5 py-3 font-semibold text-hoppr-black transition hover:bg-opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hoppr-purple focus-visible:ring-offset-2"
        @click="returnHome"
      >
        Retour à l’accueil
      </button>
    </section>
  </NuxtLayout>
</template>
