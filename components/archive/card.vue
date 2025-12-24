<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import MarkdownIt from 'markdown-it'

interface Props {
  path?: string
  title?: string
  date?: string
  description?: string
  image?: string
  alt?: string
  ogImage?: string
  tags?: Array<string>
  published?: boolean
  imageSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  path: '/',
  title: 'no-title',
  date: 'no-date',
  description: 'no-description',
  image: '/not-found.jpg',
  alt: 'no-alt',
  ogImage: '/not-found.jpg',
  tags: () => [],
  published: false,
  imageSize: 'h-48',
})

const md = new MarkdownIt()
const renderedDescription = computed(() => md.renderInline(props.description))

const showAllTags = ref(false)

const isMobile = ref(false)

onMounted(() => {
  const handleResize = () => {
    isMobile.value = window.innerWidth < 640
  }

  handleResize() // Initialisation
  window.addEventListener('resize', handleResize)

  // Nettoyage de l'écouteur d'événements lors du démontage du composant
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
</script>

<template>
  <article
    class="group border dark:border-zinc-500 m-2 rounded-2xl overflow-hidden shadow-sm text-zinc-700 dark:text-zinc-300"
  >
    <NuxtLink :to="path" class="grid grid-cols-1 sm:grid-cols-10 gap-1">
      <div :class="`sm:col-span-3 relative overflow-hidden rounded-t-2xl sm:rounded-l-2xl sm:rounded-t-none ${imageSize}`">
        <!-- Background Layer (Ambience) -->
        <img
          :src="image" aria-hidden="true" role="presentation"
          class="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-100 transition-transform duration-500 group-hover:scale-130"
        >
        <!-- Foreground Layer -->
        <img
          class="w-full h-full object-contain object-center relative z-10 group-hover:scale-110 transition-transform duration-500 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] webkit-mask-image-[radial-gradient(ellipse_at_center,black_60%,transparent_100%)]"
          width="300" :src="image" :alt="alt"
        >
      </div>
      <div class="sm:col-span-7 p-5 relative">
        <div class="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white dark:from-zinc-800 to-transparent opacity-90" />
        <h2
          class="text-lg font-bold text-black dark:text-zinc-300 pb-1 relative group-hover:text-hoppr-green dark:group-hover:text-hoppr-green text-ellipsis line-clamp-1"
        >
          {{ title }}
        </h2>
        <div class="font-luciole text-ellipsis line-clamp-2" v-html="renderedDescription" />
        <div class="text-black dark:text-zinc-300 text-xs mt-2 mb-1 flex flex-col gap-3 md:flex-row md:items-center md:space-x-6 font-luciole">
          <div class="flex items-center">
            <LogoDate />
            <p class="pt-1">
              {{ date }}
            </p>
          </div>
          <div class="flex items-center gap-2 flex-wrap" role="list" aria-label="Tags de l'article">
            <LogoTag />
            <template v-for="tag in visibleTags" :key="tag">
              <span class="inline-flex items-center justify-center bg-hoppr-purple text-white rounded-md px-2 pb-0 text-[0.65rem] font-bold uppercase tracking-widest shadow-sm leading-normal" role="listitem" style="padding-top: 0.25em">{{ tag }}</span>
            </template>
            <button
              v-if="props.tags.length > 2"
              class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hoppr-purple"
              :aria-expanded="showAllTags"
              :aria-label="buttonLabel"
              @click="toggleTags"
            >
              <span>{{ showAllTags ? 'Moins' : `+${remainingTagsCount}` }}</span>
            </button>
          </div>
        </div>
        <div class="flex group-hover:underline text-hoppr-green dark:text-hoppr-green items-center pt-2">
          <p>Lire la suite</p>
          <LogoArrow />
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
