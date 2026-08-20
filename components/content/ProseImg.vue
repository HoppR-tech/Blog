<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
  width?: string | number
  height?: string | number
}>()

const dialog = ref<HTMLDialogElement>()
const trigger = ref<HTMLButtonElement>()

function openImage() {
  dialog.value?.showModal()
}

function restoreFocus() {
  trigger.value?.focus()
}
</script>

<template>
  <div class="group relative my-4 w-fit max-w-full">
    <img
      :src="props.src"
      :alt="props.alt || ''"
      :width="props.width || 800"
      :height="props.height || 450"
      loading="lazy"
      decoding="async"
      class="block rounded-lg max-w-full"
    >
    <button
      ref="trigger"
      type="button"
      class="prose-img-trigger pointer-events-none absolute bottom-3 right-3 hidden min-h-11 cursor-pointer items-center gap-1.5 rounded-md border border-hoppr-purple bg-white/95 px-3 py-2 text-sm font-medium text-hoppr-purple opacity-0 shadow-md transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 hover:bg-hoppr-purple hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hoppr-purple motion-reduce:transition-none lg:inline-flex dark:border-hoppr-green dark:bg-hoppr-black/95 dark:text-hoppr-green dark:hover:bg-hoppr-green dark:hover:text-hoppr-black dark:focus-visible:outline-hoppr-green"
      @click="openImage"
    >
      <Icon name="mdi:fullscreen" class="size-5" aria-hidden="true" />
      <span aria-hidden="true">Agrandir</span>
      <span class="sr-only">Agrandir l’image</span>
    </button>
    <dialog
      ref="dialog"
      aria-label="Image agrandie"
      class="prose-img-dialog max-h-[calc(100vh-2rem)] w-[min(92vw,80rem)] max-w-[calc(100vw-2rem)] rounded-lg bg-white p-4 shadow-2xl dark:bg-hoppr-black"
      @close="restoreFocus"
    >
      <button
        type="button"
        class="mb-2 ml-auto flex size-11 cursor-pointer items-center justify-center rounded-md border border-hoppr-purple text-hoppr-purple hover:bg-hoppr-purple hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hoppr-purple dark:border-hoppr-green dark:text-hoppr-green dark:hover:bg-hoppr-green dark:hover:text-hoppr-black dark:focus-visible:outline-hoppr-green"
        aria-label="Fermer l’image agrandie"
        @click="dialog?.close()"
      >
        <Icon name="mdi:close" class="size-6" aria-hidden="true" />
      </button>
      <img
        :src="props.src"
        :alt="props.alt || ''"
        loading="lazy"
        decoding="async"
        class="block h-[min(75vh,52rem)] max-h-[calc(100vh-8rem)] w-full object-contain"
      >
    </dialog>
  </div>
</template>

<style>
@media (hover: none) {
  .prose-img-trigger {
    pointer-events: auto;
    opacity: 1;
  }
}

.prose-img-dialog::backdrop {
  background: rgb(0 0 0 / 75%);
}
</style>
