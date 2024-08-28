<script setup lang="ts">
import { ref } from 'vue'

const { path } = useRoute()
const articles = await queryContent(path).findOne()

const expandedSections = ref<Set<string>>(new Set(articles?.body?.toc?.links.map(link => link.id) || []))

const links = computed(() => {
  const result: any[] = []
  articles?.body?.toc?.links.forEach((link) => {
    result.push(link)
    if (link.children)
      result.push(...link.children.map(child => ({ ...child, parent: link.id })))
  })
  return result
})

function toggleSection(id: string) {
  if (expandedSections.value.has(id))
    expandedSections.value.delete(id)
  else
    expandedSections.value.add(id)
}

const isExpanded = (id: string) => expandedSections.value.has(id)
</script>

<template>
  <div class="lg:col-span-3 sticky top-28 mt-5 h-96 hidden lg:block justify-self-end w-full">
    <div class="border dark:border-zinc-500 p-4 rounded-md w-[250px] max-w-[350px] dark:bg-slate-900 shadow-md">
      <h2 class="text-lg font-bold mb-4 border-b dark:border-zinc-500 pb-2 text-hoppr-green">
        Table des matières
      </h2>
      <div class="relative">
        <div
          v-for="(link, index) in links" :key="link.id" class="flex items-start relative" :class="{
            'mb-4': link.depth === 2,
            'mb-2': link.depth === 3 && isExpanded(link.parent),
          }"
        >
          <div class="w-6 flex-shrink-0 flex items-center justify-center">
            <button
              v-if="link.depth === 2"
              class="text-hoppr-green hover:text-opacity-80 transition-colors duration-200 w-full text-left"
              @click="toggleSection(link.id)"
            >
              {{ link.children ? (isExpanded(link.id) ? '▾' : '▸') : '•' }}
            </button>
          </div>
          <div
            v-if="link.depth === 3 && isExpanded(link.parent)"
            class="absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-zinc-600" :style="{
              top: index > 0 && links[index - 1].depth === 2 ? '0' : '-4px',
              height: 'calc(100% + 8px)',
              left: '0.75rem',
            }"
          />
          <div
            v-if="link.depth === 3 && isExpanded(link.parent)" class="absolute w-2 h-px bg-gray-300 dark:bg-zinc-600"
            :style="{
              top: '0.9rem',
              left: '0.75rem',
            }"
          />
          <NuxtLink
            v-if="link.depth === 2 || (link.depth === 3 && isExpanded(link.parent))" :to="`#${link.id}`"
            class="block text-sm transition-colors duration-200 flex-grow" :class="{
              'font-semibold hover:text-hoppr-green': link.depth === 2,
              'text-gray-600 dark:text-gray-400 hover:text-hoppr-green dark:hover:text-hoppr-green': link.depth === 3,
              'ml-0': link.depth === 2,
              'ml-4': link.depth === 3,
            }"
          >
            {{ link.text }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
