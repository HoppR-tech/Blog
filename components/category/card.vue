<script setup lang="ts">
interface Props {
  title: string
  count: number
}

withDefaults(defineProps<Props>(), {
  title: 'No title available',
  count: 0,
})

// some random color for tags
const color = [
  '#22c55e', // vert
  '#3b82f6', // bleu
  '#f59e0b', // orange
  '#8b5cf6', // violet
  '#ec4899', // rose
  '#14b8a6', // turquoise
  '#f43f5e', // rouge-rose
  '#6366f1', // indigo
  '#0ea5e9', // bleu ciel
  '#84cc16', // vert citron
]

// get a random number
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const picAColor = ref(`${color.at(getRandomInt(0, 8))}`)
</script>

<template>
  <div
    class="px-5 py-3 rounded
    rand-bg-color hover:scale-110 transition-all duration-300"
  >
    <NuxtLink :to="`/categories/${title.toLocaleLowerCase()}`" class="text-lg font-extrabold">
      <h1 class="text-white">
        #{{ title }} ({{ count }})
      </h1>
    </NuxtLink>
  </div>
</template>

<style scoped>
.rand-bg-color {
  background-color: v-bind(picAColor);
}
</style>
