<script setup lang="ts">
import { Icon } from '#components'

interface Props {
  title?: string
  value: string
  count?: number
  index?: number
  totalTags?: number
  icon: string
  colors: {
    light: string
    dark: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  title: 'No title available',
  count: 0,
  index: 0,
  totalTags: 1,
})
</script>

<template>
  <div
    class="category-card px-5 py-3 rounded hover:scale-110 transition-all duration-300"
    :style="{
      '--category-color-light': props.colors.light,
      '--category-color-dark': props.colors.dark,
    }"
  >
    <NuxtLink
      :to="`/categories/${props.value}`"
      class="text-lg font-extrabold tracking-wider flex items-center text-white dark:text-hoppr-black"
    >
      <Icon
        :name="props.icon"
        size="24"
        class="mr-2"
      />
      <span>{{ title }} ({{ count }})</span>
    </NuxtLink>
  </div>
</template>

<style scoped>
.category-card {
  background-color: var(--category-color-light);
}

:global(.dark) .category-card {
  background-color: var(--category-color-dark);
}
</style>
