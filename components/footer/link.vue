<script setup lang="ts">
const menuItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Tous nos Articles', to: '/blogs' },
  { label: 'Catégories', to: '/categories' },
  { label: 'À Propos', to: 'https://hoppr.tech' },
]
</script>

<template>
  <div class="flex flex-col dark:text-zinc-300 my-5 md:my-0 md:justify-self-center">
    <p class="text-black dark:text-zinc-300 text-base font-semibold mb-4">
      Liens Rapides
    </p>
    <ul class="space-y-3">
      <li v-for="item in menuItems" :key="item.to" class="flex items-center">
        <span class="text-hoppr-green mr-2">➤</span>
        <NuxtLink :to="item.to" class="hover:underline py-0.5">
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
