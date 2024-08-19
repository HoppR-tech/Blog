<script setup lang="ts">
import type { Person } from '@/types/blog'

interface Props {
  title: string
  image: string
  alt: string
  description: string
  date: string
  tags: Array<string>
  authors: Person[]
  reviewers: Person[]
}

const props = withDefaults(defineProps<Props>(), {
  title: 'no-title',
  image: '#',
  alt: 'no-img',
  description: 'no description',
  date: 'no-date',
  tags: () => ([]),
  authors: () => [{
    notionId: '',
    name: 'Auteur inconnu',
    image: '/default-author-image.webp',
  }],
  reviewers: () => [],
})

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}
</script>

<template>
  <header>
    <h1 class="text-2xl dark:text-zinc-300 md:text-3xl lg:text-4xl m-7 font-bold text-center">
      {{ title || '' }}
    </h1>
    <img
      :src="image || ''" :alt="alt || `Image illustrant l'article : ${title}`" width="600"
      class="m-auto rounded-2xl shadow-lg h-32 md:h-72 w-4/6 md:w-4/5 content-center object-cover"
    >
    <!-- <p class="text-xs sm:text-sm my-3 max-w-xl mx-auto text-center text-zinc-600 dark:text-zinc-400">
      {{ description }}
    </p> -->
    <div class="flex flex-col w-full justify-start text-sm md:text-base my-8">
      <div class="flex flex-wrap justify-start text-black dark:text-zinc-300 content-center gap-4 text-sm sm:text-base">
        <div class="flex items-start font-semibold w-full mb-2">
          <LogoAuthor class="flex-shrink-0 mt-0.5 mr-2" />
          <p>
            Écrit par :
            <template v-for="(author, index) in props.authors" :key="author.notionId">
              <a :href="author.linkedin" target="_blank" rel="noopener noreferrer" class="hover:underline">
                {{ author.name }}
              </a>
              <template v-if="index < props.authors.length - 1">
                |
              </template>
            </template>
          </p>
        </div>
        <div class="flex items-start font-semibold w-full mb-2">
          <LogoDate class="flex-shrink-0 mt-0.5 mr-2" />
          <p>{{ formatDate(date) }}</p>
        </div>
        <div class="flex items-start gap-2 flex-wrap w-full">
          <LogoTag class="flex-shrink-0 mt-0.5" />
          <template v-for="tag in props.tags" :key="tag">
            <span class="bg-gray-200 dark:bg-slate-900 rounded-md px-2 py-1 font-semibold">{{ tag }}</span>
          </template>
        </div>
      </div>
      <div v-if="props.reviewers.length > 0" class="flex justify-start mt-4 text-black dark:text-zinc-300 text-sm sm:text-base">
        <div class="flex items-start font-semibold">
          <LogoAuthor class="flex-shrink-0 mt-0.5 mr-2" />
          <p>
            Relu par :
            <template v-for="(reviewer, index) in props.reviewers" :key="reviewer.notionId">
              <a :href="reviewer.linkedin" target="_blank" rel="noopener noreferrer" class="hover:underline">
                {{ reviewer.name }}
              </a>
              <template v-if="index < props.reviewers.length - 1">
                |
              </template>
            </template>
          </p>
        </div>
      </div>
    </div>
  </header>
  <hr class="border-t border-gray-300 dark:border-zinc-700 my-8 w-full max-w-5xl mx-auto">
</template>
