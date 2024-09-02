<script setup lang="ts">
import { Icon } from '#components'

interface Props {
  title: string
  value: string
  count: number
  index: number
  totalTags: number
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

const colorMode = useColorMode()

const getCategoryColor = computed(() => {
  return colorMode.value === 'dark' ? props.colors.dark : props.colors.light
})
</script>

<template>
  <ClientOnly>
    <div
      class="px-5 py-3 rounded hover:scale-110 transition-all duration-300"
      :style="{ backgroundColor: getCategoryColor }"
    >
      <NuxtLink :to="`/categories/${props.value}`" class="text-lg font-extrabold tracking-wider flex items-center">
        <Icon
          :name="props.icon"
          size="24"
          class="mr-2"
          :class="{ 'text-white': colorMode.value === 'light', 'text-hoppr-black': colorMode.value === 'dark' }"
        />
        <h1 :class="{ 'text-white': colorMode.value === 'light', 'text-hoppr-black': colorMode.value === 'dark' }">
          {{ title }} ({{ count }})
        </h1>
      </NuxtLink>
    </div>
  </ClientOnly>
</template>
