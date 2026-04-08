<script setup lang="ts">
defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <code class="prose-inline-code">
    <slot />
  </code>
</template>

<style>
.prose-inline-code {
  background-color: #f3f4f6 !important; /* gray-100 — matches prod */
  color: #2F2D85 !important; /* hoppr-purple — matches prod */
  padding: 0.2em 0.4em !important;
  border-radius: 4px;
  font-size: 0.875em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

html.dark .prose-inline-code {
  background-color: #1f2937 !important; /* gray-800 — matches prod */
  color: #00cca5 !important; /* hoppr-green — matches prod */
}
</style>
