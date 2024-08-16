<script setup lang="ts">
import type { Person } from '@/types/blog'

interface Props {
  authors: Person[]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="py-5 border-t dark:border-zinc-500 mt-5 text-zinc-700 dark:text-zinc-300">
    <div class="container max-w-5xl mx-auto">
      <h3 class="text-xl font-semibold mb-4 text-center">
        À propos des auteurs
      </h3>
      <div class="flex flex-col items-center">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          <template v-for="(author, index) in props.authors" :key="author.notionId">
            <div class="flex flex-col sm:flex-row items-center mb-4 sm:mb-0 relative sm:px-4">
              <img :src="author.image" :alt="author.name" class="w-16 h-16 rounded-full mb-2 sm:mb-0 sm:mr-4 object-cover">
              <div class="text-center sm:text-left">
                <p class="font-semibold text-base">
                  {{ author.name }}
                </p>
                <div class="flex justify-center sm:justify-start space-x-2 mt-2">
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
                </div>
              </div>
              <div v-if="index % 2 === 0 && index !== props.authors.length - 1" class="hidden sm:block absolute right-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-zinc-600" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
