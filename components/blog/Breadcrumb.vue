<script setup lang="ts">
import { useAbsoluteUrl } from '@/composables/useAbsoluteUrl'
import { categories } from '@/utils/categories'

const props = defineProps<Props>()

const TRAILING_SLASH = /\/$/

interface Props {
  title: string
  path: string
  tags?: string[]
  /** Override for non-article pages (e.g., category or tag pages) */
  customItems?: Array<{ name: string, url: string }>
}

const baseUrl = useAbsoluteUrl('/')

function findPrimaryCategory(tags: string[]): { label: string, value: string } | null {
  if (!tags || tags.length === 0)
    return null

  for (const tag of tags) {
    const cat = categories.find(c => c.value.toLowerCase() === tag.toLowerCase())
    if (cat)
      return { label: cat.label, value: cat.value }
  }

  return null
}

const breadcrumbItems = computed(() => {
  if (props.customItems) {
    return [
      { name: 'Accueil', url: baseUrl.replace(TRAILING_SLASH, '') },
      ...props.customItems,
    ]
  }

  const items: Array<{ name: string, url: string }> = [
    { name: 'Accueil', url: baseUrl.replace(TRAILING_SLASH, '') },
  ]

  const primaryCategory = findPrimaryCategory(props.tags || [])
  if (primaryCategory) {
    items.push({
      name: primaryCategory.label,
      url: `${baseUrl.replace(TRAILING_SLASH, '')}/categories/${primaryCategory.value}`,
    })
  }

  items.push({
    name: props.title,
    url: useAbsoluteUrl(props.path),
  })

  return items
})

const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': breadcrumbItems.value.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': item.name,
    'item': item.url,
  })),
}))

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd.value),
    },
  ],
})
</script>

<template>
  <nav aria-label="Fil d'Ariane" class="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
    <ol class="flex flex-wrap items-center gap-1">
      <li v-for="(item, index) in breadcrumbItems" :key="item.url" class="flex items-center">
        <span v-if="index > 0" class="mx-1">&gt;</span>
        <NuxtLink
          v-if="index < breadcrumbItems.length - 1"
          :to="item.url"
          class="hover:text-hoppr-green transition-colors"
        >
          {{ item.name }}
        </NuxtLink>
        <span v-else class="text-zinc-700 dark:text-zinc-200 font-medium">
          {{ item.name }}
        </span>
      </li>
    </ol>
  </nav>
</template>
