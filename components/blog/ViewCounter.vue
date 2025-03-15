<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  slug: string
}>()

const views = ref<number | null>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    // Ensure slug starts with a forward slash
    const normalizedSlug = props.slug.startsWith('/') ? props.slug : `/${props.slug}`

    // Increment view count
    const response = await fetch(`/api/views${normalizedSlug}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()
    views.value = data.views
  }
  catch (err) {
    console.error('Error handling view count:', err)
    error.value = 'Erreur de chargement des vues'
  }
})
</script>

<template>
  <div v-if="error" class="text-red-500">
    {{ error }}
  </div>
  <div v-else-if="views === null" class="text-gray-500">
    Chargement...
  </div>
  <div v-else class="text-gray-700 dark:text-gray-300">
    {{ views }} vue{{ views !== 1 ? 's' : '' }}
  </div>
</template>
