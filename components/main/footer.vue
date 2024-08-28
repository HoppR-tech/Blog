<script setup lang="ts">
const route = useRoute()

const path = computed(() => route.fullPath.replace('/', ''))
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="py-5 border-t-2 dark:border-zinc-500 mt-10 text-zinc-700 dark:text-zinc-300 bg-gray-100 dark:bg-slate-900 shadow-md font-luciole text-sm">
    <div class="px-6 container max-w-5xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="space-y-4">
          <FooterSite v-if="path === 'about'" />
          <FooterDevloper v-else />
        </div>
        <FooterLink class="space-y-4" />
        <FooterConnect class="space-y-4" />
      </div>

      <div class="border-t dark:border-zinc-500 mt-5 text-center p-2 font-fira">
        © 2023-{{ currentYear }} No Right is reserved. Who cares 🤷‍♂️? It's
        <a href="https://github.com/HoppR-tech/blog" target="_blank" rel="nofollow" class="underline">open source</a>
        anyway.
      </div>
    </div>
  </div>
</template>

<style>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: all 0.4s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
