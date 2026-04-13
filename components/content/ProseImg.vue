<script setup lang="ts">
const props = defineProps<{
  src: string
  alt?: string
  width?: string | number
  height?: string | number
}>()
</script>

<template>
  <img
    :src="props.src"
    :alt="props.alt || ''"
    :width="props.width || 800"
    :height="props.height || 450"
    loading="lazy"
    decoding="async"
    class="rounded-lg max-w-full"
  >
</template>
