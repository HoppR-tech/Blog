<script setup lang="ts">
import { ref } from 'vue'
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
  setTimeout(() => {
    if (!document.activeElement?.closest('.search-bar-container'))
      toggleSearch()
  }, 200)
}

defineExpose({ toggleSearch, isExpanded, performSearch })
</script>

<template>
  <div class="search-bar-container relative flex items-center">
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="w-0 opacity-0 scale-x-0"
      enter-to-class="w-64 opacity-100 scale-x-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="w-64 opacity-100 scale-x-100"
      leave-to-class="w-0 opacity-0 scale-x-0"
    >
      <div
        v-if="isExpanded"
        class="flex items-center origin-right"
      >
        <div class="relative">
          <input
            ref="inputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un article..."
            class="w-64 bg-white/10 backdrop-blur-sm text-white placeholder-hoppr-green/60 rounded-full pl-4 pr-10 py-2 outline-none border border-hoppr-green/30 focus:border-hoppr-green focus:bg-hoppr-green/10 focus:shadow-[0_0_12px_rgba(0,204,165,0.15)] transition-all duration-200"
            aria-label="Rechercher un article"
            @keyup.enter="performSearch"
            @blur="onBlur"
          >
          <button
            class="absolute right-3 inset-y-0 flex items-center text-hoppr-green/50 hover:text-hoppr-green transition-colors duration-200"
            aria-label="Fermer la recherche"
            @click="toggleSearch"
          >
            <Icon name="mdi:close" size="18" />
          </button>
        </div>
      </div>
    </transition>
    <button
      class="p-2 text-gray-100 hover:text-hoppr-green rounded-full transition-all duration-200"
      :class="{ 'ml-2': isExpanded }"
      :aria-label="isExpanded ? 'Effectuer la recherche' : 'Ouvrir la recherche'"
      @click="isExpanded ? performSearch() : toggleSearch()"
    >
      <Icon name="mdi:magnify" size="24" />
    </button>
  </div>
</template>
