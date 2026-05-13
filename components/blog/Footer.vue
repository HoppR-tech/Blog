<script setup lang="ts">
import type { Person } from '@/types/blog'
import { slugifyAuthorName } from '@/utils/authorsAggregation'

interface Props {
  authors: Person[]
}

const props = defineProps<Props>()

const isSingleAuthor = computed(() => props.authors.length === 1)

function authorProfilePath(person: Person): string {
  return `/auteurs/${slugifyAuthorName(person.name)}`
}
</script>

<template>
  <div class="py-5 border-t dark:border-zinc-500 mt-5 text-zinc-700 dark:text-zinc-300">
    <div class="container max-w-6xl mx-auto">
      <h3 class="text-xl font-semibold mb-4 text-center">
        {{ isSingleAuthor ? 'À propos de l\'auteur' : 'À propos des auteurs' }}
      </h3>
      <div class="flex flex-col items-center">
        <div :class="{ 'grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl': !isSingleAuthor, 'flex justify-center': isSingleAuthor }">
          <template v-for="(author, index) in props.authors" :key="author.notionId">
            <div :class="{ 'flex flex-row items-center mb-6 sm:mb-0 relative sm:px-4': !isSingleAuthor, 'flex flex-row items-center': isSingleAuthor }">
              <NuxtLink :to="authorProfilePath(author)" :aria-label="`Profil de ${author.name}`">
                <NuxtImg :src="author.image" :alt="author.name" width="64" height="64" loading="lazy" decoding="async" sizes="64px" format="webp" :quality="80" class="w-16 h-16 rounded-full mb-0 sm:mr-4 object-cover hover:opacity-80 transition-opacity" />
              </NuxtLink>
              <div class="text-left ml-4">
                <NuxtLink :to="authorProfilePath(author)" rel="author" class="font-semibold text-base hover:underline">
                  {{ author.name }}
                </NuxtLink>
                <p v-if="author.jobTitle" class="text-sm text-zinc-600 dark:text-zinc-400">
                  {{ author.jobTitle }}
                </p>
                <p v-if="author.bio" class="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-3">
                  {{ author.bio }}
                </p>
                <div class="flex justify-start space-x-2 mt-2">
                  <a
                    v-if="author.linkedin" :href="author.linkedin" target="_blank" rel="noopener noreferrer"
                    class="text-hoppr-green hover:text-opacity-80" aria-label="LinkedIn"
                  >
                    <Icon name="fa:linkedin-square" size="1.5em" />
                  </a>
                  <a
                    v-if="author.x" :href="author.x" target="_blank" rel="noopener noreferrer"
                    class="text-hoppr-green hover:text-opacity-80" aria-label="Twitter"
                  >
                    <Icon name="fa:twitter-square" size="1.5em" />
                  </a>
                  <a
                    v-if="author.github" :href="author.github" target="_blank" rel="noopener noreferrer"
                    class="text-hoppr-green hover:text-opacity-80" aria-label="GitHub"
                  >
                    <Icon name="fa:github-square" size="1.5em" />
                  </a>
                </div>
              </div>
              <div v-if="!isSingleAuthor && index % 2 === 0 && index !== props.authors.length - 1" class="hidden sm:block absolute right-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-zinc-600" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
