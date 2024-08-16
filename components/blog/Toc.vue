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

function isLastChild(index: number): boolean {
  return index === links.value.length - 1 || (links.value[index + 1].depth === 2 && links.value[index].depth === 3)
}
</script>

<template>
  <div class="lg:col-span-3 sticky top-28 mt-5 h-96 hidden lg:block justify-self-end">
    <div class="border dark:border-zinc-500 p-3 rounded-md min-w-[200px] dark:bg-slate-900">
      <h1 class="text-sm font-bold mb-3 border-b dark:border-zinc-500 pb-2">
        Table des matières
      </h1>
      <div class="relative">
        <div
          v-for="(link, index) in links"
          :key="link.id"
          class="flex items-start relative"
        >
          <div class="w-4 mr-2 flex items-center justify-center h-full">
            <div
              v-if="link.depth === 2 && link.children"
              class="cursor-pointer"
              @click="toggleSection(link.id)"
            >
              {{ isExpanded(link.id) ? '▾' : '▸' }}
            </div>
          </div>
          <div
            v-if="link.depth === 3 && isExpanded(link.parent)"
            class="absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-zinc-600"
            :style="{
              top: index > 0 && links[index - 1].depth === 2 ? '0' : '-8px',
              height: isLastChild(index) ? '100%' : 'calc(100% + 8px)',
              left: '0.5rem',
            }"
          />
          <div
            v-if="link.depth === 3 && isExpanded(link.parent)"
            class="absolute w-2 h-px bg-gray-300 dark:bg-zinc-600"
            :style="{
              top: '0.7rem',
              left: '0.5rem',
            }"
          />
          <NuxtLink
            v-if="link.depth === 2 || (link.depth === 3 && isExpanded(link.parent))"
            :to="`#${link.id}`"
            class="block text-xs hover:underline py-1"
            :class="{
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
