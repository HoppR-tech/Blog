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
  <div class="prose-pre-wrapper relative rounded-lg overflow-hidden my-4">
    <div class="flex items-center justify-between px-3 py-1.5 bg-gray-900 rounded-t-lg">
      <span v-if="language" class="text-sm font-mono font-semibold text-white uppercase tracking-wide">{{ language }}</span>
      <button
        class="bg-hoppr-green hover:bg-opacity-80 text-hoppr-black rounded px-2 py-1 text-xs flex items-center"
        :aria-label="copied ? 'Code copié' : 'Copier le code'"
        @click="copyCode"
      >
        <span class="mr-1">{{ copied ? 'Copié' : 'Copier' }}</span>
        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v12h2V3h12V1Z" /></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59L21 7Z" /></svg>
      </button>
    </div>
    <pre class="shiki"><code class="shiki"><slot /></code></pre>
  </div>
</template>

<style>
.prose-pre-wrapper pre.shiki {
  margin: 0 !important;
  border-radius: 0 0 0.5rem 0.5rem;
  padding: 1rem 1.5rem !important;
  background-color: #111827 !important;
  overflow-x: auto;
}

.prose-pre-wrapper pre.shiki code.shiki {
  background-color: transparent !important;
  padding: 0 !important;
  font-size: 0.875rem;
  display: block;
  width: fit-content;
  min-width: 100%;
}

.prose-pre-wrapper pre.shiki code .line {
  display: block;
  min-height: 1rem;
}
</style>
