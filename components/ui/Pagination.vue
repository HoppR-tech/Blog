<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  baseUrl: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'pageChange', page: number): void
}>()

const isMobile = ref(false)

function updateIsMobile() {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

const maxVisible = computed(() => isMobile.value ? 3 : 7)

const pageRange = computed(() => {
  if (props.totalPages <= maxVisible.value) {
    return Array.from({ length: props.totalPages }, (_, i) => i + 1)
  }

  const half = Math.floor(maxVisible.value / 2)
  let start = Math.max(1, props.currentPage - half)
  const end = Math.min(props.totalPages, start + maxVisible.value - 1)

  if (end - start + 1 < maxVisible.value) {
    start = Math.max(1, end - maxVisible.value + 1)
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
  <nav aria-label="Pagination" class="flex justify-center items-center gap-1 sm:gap-2 my-8 px-2">
    <NuxtLink
      v-if="currentPage > 1"
      :to="pageUrl(currentPage - 1)"
      class="px-2 sm:px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-hoppr-green hover:text-white transition-colors"
      aria-label="Page précédente"
      @click.prevent="goToPage(currentPage - 1)"
    >
      <span class="hidden sm:inline">Précédent</span>
      <span class="sm:hidden" aria-hidden="true">&lsaquo;</span>
    </NuxtLink>
    <span
      v-else
      class="px-2 sm:px-3 py-2 rounded-md text-sm font-medium text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
      aria-disabled="true"
    >
      <span class="hidden sm:inline">Précédent</span>
      <span class="sm:hidden" aria-hidden="true">&lsaquo;</span>
    </span>

    <!-- First page + ellipsis if needed -->
    <template v-if="pageRange[0] !== undefined && pageRange[0] > 1">
      <NuxtLink
        :to="pageUrl(1)"
        class="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-hoppr-green hover:text-white transition-colors"
        aria-label="Page 1"
        @click.prevent="goToPage(1)"
      >
        1
      </NuxtLink>
      <span v-if="pageRange[0] > 2" class="px-1 text-zinc-400">...</span>
    </template>

    <template v-for="page in pageRange" :key="page">
      <NuxtLink
        v-if="page !== currentPage"
        :to="pageUrl(page)"
        class="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-hoppr-green hover:text-white transition-colors"
        :aria-label="`Page ${page}`"
        @click.prevent="goToPage(page)"
      >
        {{ page }}
      </NuxtLink>
      <span
        v-else
        class="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm font-bold bg-hoppr-green text-white"
        aria-current="page"
        :aria-label="`Page ${page}, page courante`"
      >
        {{ page }}
      </span>
    </template>

    <!-- Last page + ellipsis if needed -->
    <template v-if="pageRange[pageRange.length - 1] !== undefined && pageRange[pageRange.length - 1]! < totalPages">
      <span v-if="pageRange[pageRange.length - 1]! < totalPages - 1" class="px-1 text-zinc-400">...</span>
      <NuxtLink
        :to="pageUrl(totalPages)"
        class="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-hoppr-green hover:text-white transition-colors"
        :aria-label="`Page ${totalPages}`"
        @click.prevent="goToPage(totalPages)"
      >
        {{ totalPages }}
      </NuxtLink>
    </template>

    <NuxtLink
      v-if="currentPage < totalPages"
      :to="pageUrl(currentPage + 1)"
      class="px-2 sm:px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-hoppr-green hover:text-white transition-colors"
      aria-label="Page suivante"
      @click.prevent="goToPage(currentPage + 1)"
    >
      <span class="hidden sm:inline">Suivant</span>
      <span class="sm:hidden" aria-hidden="true">&rsaquo;</span>
    </NuxtLink>
    <span
      v-else
      class="px-2 sm:px-3 py-2 rounded-md text-sm font-medium text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
      aria-disabled="true"
    >
      <span class="hidden sm:inline">Suivant</span>
      <span class="sm:hidden" aria-hidden="true">&rsaquo;</span>
    </span>
  </nav>
</template>
