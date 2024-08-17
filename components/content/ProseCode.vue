<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: '',
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
})

const copied = ref(false)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch (error) {
    console.error('Failed to copy text: ', error)
  }
}
</script>

<template>
  <div class="relative bg-gray-900 rounded-lg overflow-hidden">
    <div class="absolute top-0 left-0 m-2 text-xs text-gray-500">
      {{ language }}
    </div>
    <div class="absolute top-0 right-0 m-2">
      <button
        class="bg-hoppr-green hover:bg-opacity-80 text-white rounded px-2 py-1 text-xs sm:text-sm flex items-center"
        :aria-label="copied ? 'Code copié' : 'Copier le code'"
        @click="copyCode"
      >
        <span class="mr-1">{{ copied ? 'Copié' : 'Copier' }}</span>
        <Icon name="mdi:content-copy" size="16" />
      </button>
    </div>
    <div class="p-4 pt-8 bg-gray-900">
      <slot />
    </div>
  </div>
</template>

<style>
pre code .line {
  display: block;
  min-height: 1rem;
}

.prose pre {
  background-color: #101827;
}

.dark .prose pre code {
  color: #e2e8f0;
}

.dark .prose pre button {
  background-color: #4a5568;
}

.dark .prose pre button:hover {
  background-color: #2d3748;
}
</style>
