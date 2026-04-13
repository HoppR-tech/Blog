<script lang="ts" setup>
import MarkdownIt from 'markdown-it'
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  path: string
  title: string
  date: string
  description: string
  image: string
  alt: string
  ogImage: string
  tags: Array<string>
  published: boolean
}

const props = withDefaults(defineProps<Props>(), {
  path: '/',
  title: 'no-title',
  date: 'no-date',
  description: 'no-description',
  image: '/not-found.jpg',
  alt: '',
  ogImage: '/not-found.jpg',
  tags: () => [],
  published: false,
})

const md = new MarkdownIt()
const renderedDescription = computed(() => {
  const rendered = md.renderInline(props.description)
  // Strip HTML tags to avoid nested links inside NuxtLink
  return rendered.replace(/<[^>]*>/g, '')
})

const showAllTags = ref(false)
const isMobile = ref(false)

onMounted(() => {
  const handleResize = () => {
    isMobile.value = window.innerWidth < 640
  }

  handleResize()
  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})

const visibleTags = computed(() => {
  if (showAllTags.value)
    return props.tags
  return props.tags.slice(0, 2)
})

const remainingTagsCount = computed(() => {
  const visibleCount = 2
  return Math.max(0, props.tags.length - visibleCount)
})

function toggleTags(event: Event) {
  event.preventDefault()
  showAllTags.value = !showAllTags.value
}

const buttonLabel = computed(() =>
  showAllTags.value
    ? `Masquer ${remainingTagsCount.value} tag${remainingTagsCount.value > 1 ? 's' : ''}`
    : `Afficher ${remainingTagsCount.value} tag${remainingTagsCount.value > 1 ? 's' : ''} supplémentaire${remainingTagsCount.value > 1 ? 's' : ''}`,
)

// Écouter les changements de taille de l'écran
// window.addEventListener('resize', () => {
//   isMobile.value = window.innerWidth < 640
// })
</script>

<template>
  <article
    class="group border dark:border-zinc-500 m-1 sm:m-2 overflow-hidden rounded-2xl shadow-sm text-zinc-700 dark:text-zinc-300"
  >
    <NuxtLink :to="path">
      <div class="relative overflow-hidden h-32 sm:h-36 md:h-40 lg:h-48 rounded-t-2xl">
        <!-- Background Layer (Ambience) -->
        <img
          :src="image" aria-hidden="true" role="presentation"
          class="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-100 transition-transform duration-500 group-hover:scale-130"
        >
        <!-- Foreground Layer -->
        <img
          :src="image" :alt="alt || `Image de l'article : ${title}`" :width="300" :height="200" loading="lazy" decoding="async"
          class="w-full h-full object-contain object-center relative z-10 group-hover:scale-110 transition-transform duration-500 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] webkit-mask-image-[radial-gradient(ellipse_at_center,black_60%,transparent_100%)]"
        >
      </div>
      <div class="px-3 pb-4 relative">
        <div class="text-black dark:text-zinc-300 pt-3 pb-2 text-xs">
          <div class="flex items-center">
            <LogoDate />
            <p class="pt-1">
              {{ date }}
            </p>
          </div>
          <div class="flex items-center gap-2 flex-wrap mt-2" aria-label="Tags de l'article">
            <LogoTag />
            <template v-for="tag in visibleTags" :key="tag">
              <span class="inline-flex items-center justify-center bg-hoppr-purple text-white rounded-md px-2 py-1.5 text-xs font-bold uppercase tracking-widest shadow-sm leading-normal">{{ tag }}</span>
            </template>
            <span
              v-if="props.tags.length > 2"
              role="button"
              tabindex="0"
              class="inline-flex items-center justify-center bg-hoppr-purple/10 text-hoppr-purple rounded-md px-2 py-1.5 text-xs font-bold uppercase tracking-widest shadow-sm leading-normal hover:bg-hoppr-purple/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hoppr-purple transition-colors duration-300 dark:bg-purple-500/20 dark:text-purple-200 dark:hover:bg-purple-500/30 cursor-pointer"
              :aria-expanded="showAllTags"
              :aria-label="buttonLabel"
              @click.prevent="toggleTags"
              @keydown.enter.prevent="toggleTags"
              @keydown.space.prevent="toggleTags"
            >
              {{ showAllTags ? 'MOINS' : `+${remainingTagsCount}` }}
            </span>
          </div>
        </div>
        <h3
          class="text-xl font-bold text-black dark:text-zinc-300 pb-1 relative group-hover:text-hoppr-green dark:group-hover:text-hoppr-green"
        >
          {{ title }}
        </h3>
        <div class="text-ellipsis line-clamp-2 text-base text-zinc-600 dark:text-zinc-400" v-html="renderedDescription" />
        <div class="flex group-hover:underline text-hoppr-green-text dark:text-hoppr-green items-center py-2">
          <p>Lire la suite</p>
          <LogoArrow />
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
