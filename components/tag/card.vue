<script setup lang="ts">
interface Props {
  title: string
  count: number
  index: number
  totalTags: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'No title available',
  count: 0,
  index: 0,
  totalTags: 1,
})

const colors = {
  light: [
    '#00853E', // vert HoppR foncé
    '#3b82f6', // bleu
    '#22c55e', // vert
    '#8b5cf6', // violet
    '#f43f5e', // rouge-rose
    '#6366f1', // indigo
    '#0891b2', // cyan foncé
    '#d97706', // ambre foncé
    '#be123c', // rose foncé
    '#4338ca', // indigo foncé
    '#15803d', // vert foncé
    '#b91c1c', // rouge foncé
  ],
  dark: [
    '#10B981', // vert émeraude
    '#60A5FA', // bleu clair
    '#4ADE80', // vert clair
    '#A78BFA', // violet clair
    '#FB7185', // rose clair
    '#818CF8', // indigo clair
    '#22D3EE', // cyan clair
    '#FCD34D', // jaune clair
    '#F472B6', // rose vif
    '#6366F1', // indigo vif
    '#34D399', // vert menthe
    '#F87171', // rouge clair
  ],
}

const colorMode = useColorMode()

const picAColor = computed(() => {
  const currentColors = colorMode.value === 'dark' ? colors.dark : colors.light
  return currentColors[props.index % currentColors.length]
})
</script>

<template>
  <div
    class="px-5 py-3 rounded
    rand-bg-color hover:scale-110 transition-all duration-300"
  >
    <NuxtLink :to="`/tags/${title.toLocaleLowerCase()}`" class="text-lg font-extrabold">
      <h1 :class="{ 'text-white': colorMode.value === 'light', 'text-hoppr-black': colorMode.value === 'dark' }">
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
