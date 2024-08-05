<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
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
  <div class="relative">
    <slot />
    <button
      class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white rounded px-2 py-1 text-sm"
      :aria-label="copied ? 'Code copié' : 'Copier le code'"
      @click="copyCode"
    >
      {{ copied ? 'Copié !' : 'Copier' }}
    </button>
  </div>
</template>

<style>
pre code .line {
  display: block;
  min-height: 1rem;
}

.dark .prose pre button {
  background-color: #4a5568;
}

.dark .prose pre button:hover {
  background-color: #2d3748;
}
</style>
