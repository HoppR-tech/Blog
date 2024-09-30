<script setup lang="ts">
import { defineEmits, defineExpose, ref } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['close'])
const searchQuery = ref('')
const router = useRouter()
const isExpanded = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

export interface SearchBarRef {
  isExpanded: boolean
  toggleSearch: () => void
  performSearch: () => void
}

function performSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/blogs', query: { search: searchQuery.value.trim() } })
    emit('close')
    isExpanded.value = false
  }
}

function toggleSearch() {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
  else {
    searchQuery.value = ''
    emit('close')
  }
}

function onBlur() {
  // Attendre un court instant avant de fermer la barre de recherche
  setTimeout(() => {
    if (!document.activeElement?.closest('.search-bar-container'))
      toggleSearch()
  }, 100)
}

defineExpose({ toggleSearch, isExpanded, performSearch })
</script>

<template>
  <div class="relative flex items-center">
    <div
      class="flex items-center overflow-hidden transition-all duration-300 ease-in-out relative"
      :class="{ 'w-0': !isExpanded, 'w-full md:w-64': isExpanded }"
    >
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher..."
        class="w-full bg-gray-200 dark:bg-hoppr-black text-gray-800 dark:text-gray-200 rounded-full px-4 py-2 pr-10 outline-none transition-all duration-300 ease-in-out border-2 border-transparent focus:border-hoppr-green focus:ring-2 focus:ring-hoppr-green focus:ring-opacity-50"
        aria-label="Rechercher"
        @keyup.enter="performSearch"
        @blur="onBlur"
      >
      <button
        v-if="isExpanded"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300"
        aria-label="Fermer la recherche"
        @click="toggleSearch"
      >
        <Icon name="mdi:close" size="20" />
      </button>
    </div>
    <button
      class="ml-2 text-gray-100 hover:text-hoppr-green transition-transform duration-300 ease-in-out"
      :aria-label="isExpanded ? 'Effectuer la recherche' : 'Ouvrir la recherche'"
      @click="isExpanded ? performSearch() : toggleSearch()"
    >
      <Icon name="mdi:magnify" size="24" />
    </button>
  </div>
</template>
