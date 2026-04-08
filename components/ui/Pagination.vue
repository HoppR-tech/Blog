<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  baseUrl: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'pageChange', page: number): void
}>()

const maxVisible = 7

const pageRange = computed(() => {
  if (props.totalPages <= maxVisible) {
    return Array.from({ length: props.totalPages }, (_, i) => i + 1)
  }

  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, props.currentPage - half)
  const end = Math.min(props.totalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

function pageUrl(page: number): string {
  if (page === 1)
    return props.baseUrl
  return `${props.baseUrl}?page=${page}`
}

function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('pageChange', page)
  }
}
</script>

<template>
  <nav aria-label="Pagination" class="flex justify-center items-center space-x-2 my-8">
    <NuxtLink
      v-if="currentPage > 1"
      :to="pageUrl(currentPage - 1)"
      class="px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-hoppr-green hover:text-white transition-colors"
      aria-label="Page précédente"
      @click.prevent="goToPage(currentPage - 1)"
    >
      Précédent
    </NuxtLink>
    <span
      v-else
      class="px-3 py-2 rounded-md text-sm font-medium text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
      aria-disabled="true"
    >
      Précédent
    </span>

    <template v-for="page in pageRange" :key="page">
      <NuxtLink
        v-if="page !== currentPage"
        :to="pageUrl(page)"
        class="px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-hoppr-green hover:text-white transition-colors"
        :aria-label="`Page ${page}`"
        @click.prevent="goToPage(page)"
      >
        {{ page }}
      </NuxtLink>
      <span
        v-else
        class="px-3 py-2 rounded-md text-sm font-bold bg-hoppr-green text-white"
        aria-current="page"
        :aria-label="`Page ${page}, page courante`"
      >
        {{ page }}
      </span>
    </template>

    <NuxtLink
      v-if="currentPage < totalPages"
      :to="pageUrl(currentPage + 1)"
      class="px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-hoppr-green hover:text-white transition-colors"
      aria-label="Page suivante"
      @click.prevent="goToPage(currentPage + 1)"
    >
      Suivant
    </NuxtLink>
    <span
      v-else
      class="px-3 py-2 rounded-md text-sm font-medium text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
      aria-disabled="true"
    >
      Suivant
    </span>
  </nav>
</template>
