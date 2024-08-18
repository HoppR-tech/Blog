<script lang="ts" setup>
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

withDefaults(defineProps<Props>(), {
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
</script>

<template>
  <article
    class="group border dark:border-zinc-500 m-2 rounded-2xl overflow-hidden shadow-sm text-zinc-700 dark:text-zinc-300  "
  >
    <NuxtLink :to="path" class="grid grid-cols-1 sm:grid-cols-10 gap-1">
      <div class="sm:col-span-3">
        <img
          :class="`w-full object-cover object-center rounded-t-2xl sm:rounded-l-2xl sm:rounded-t-none shadow-lg group-hover:scale-[1.02] transition-all duration-500 ${imageSize}`"
          width="300" :src="image" :alt="alt"
        >
      </div>
      <div class="sm:col-span-7 p-5">
        <h2
          class="text-xl font-semibold text-black dark:text-zinc-300   pb-1 group-hover:text-hoppr-green dark:group-hover:text-hoppr-green"
        >
          {{ title }}
        </h2>
        <p class="text-ellipsis line-clamp-2">
          {{ description }}
        </p>
        <div class="text-black dark:text-zinc-300   text-sm mt-2 mb-1 md:flex md:space-x-6">
          <div class="flex items-center">
            <LogoDate />
            <p> {{ date }}</p>
          </div>
          <div class="flex items-center gap-1 flex-wrap">
            <slot name="tags">
              <LogoTag />
              <p v-for="tag in tags" :key="tag">
                <span class="bg-hoppr-purple text-white px-2 py-1 rounded-full text-xs font-semibold">{{ tag }}</span>
              </p>
            </slot>
          </div>
        </div>
        <div class="flex group-hover:underline text-hoppr-green dark:text-hoppr-green items-center pt-2">
          <p>Read More</p>
          <LogoArrow />
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
