<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const { path } = useRoute()
const articles = await queryCollection('blogs').path(path).first()

const tocLinks = articles?.body?.toc?.links || []

// Flatten parent + children pour un drawer linéaire (plus simple à scanner sur mobile
// qu'une arborescence cliquable, sur 35 000 px de page on cherche une section vite).
const flatSections = computed(() => {
  const result: { id: string, text: string, depth: number }[] = []
  for (const link of tocLinks) {
    result.push({ id: link.id, text: link.text, depth: link.depth })
    if (link.children) {
      for (const child of link.children)
        result.push({ id: child.id, text: child.text, depth: child.depth })
    }
  }
  return result
})

const isOpen = ref(false)
const currentSectionId = ref<string | null>(null)
let observer: IntersectionObserver | undefined

function openDrawer() {
  isOpen.value = true
  // Empêche le scroll arrière-plan pendant que le drawer est ouvert.
  document.body.style.overflow = 'hidden'
}

function closeDrawer() {
  isOpen.value = false
  document.body.style.overflow = ''
}

async function scrollToSection(id: string) {
  closeDrawer()
  await nextTick()
  const el = document.getElementById(id)
  if (!el)
    return
  const offset = 80 // hauteur header sticky approx
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value)
    closeDrawer()
}

onMounted(() => {
  // Track section visible pour highlight l'item courant dans le drawer.
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          currentSectionId.value = entry.target.id
          break
        }
      }
    },
    { rootMargin: '-20% 0% -70% 0%' },
  )
  for (const section of flatSections.value) {
    const el = document.getElementById(section.id)
    if (el)
      observer.observe(el)
  }
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div v-if="flatSections.length > 0" class="lg:hidden">
    <!-- FAB déclencheur, ancré en bas-droite (zone de pouce, Fitts's Law) -->
    <button
      type="button"
      aria-label="Ouvrir la table des matières"
      :aria-expanded="isOpen"
      aria-controls="toc-mobile-drawer"
      class="fixed bottom-5 right-5 z-40 bg-hoppr-green text-white rounded-full w-12 h-12 shadow-lg flex items-center justify-center active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hoppr-green"
      @click="openDrawer"
    >
      <Icon name="fa:list-ul" size="1.25em" />
    </button>

    <!-- Backdrop + bottom-sheet drawer -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        @click="closeDrawer"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="isOpen"
        id="toc-mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Table des matières"
        class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col"
      >
        <div class="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-700">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Sections
          </h2>
          <button
            type="button"
            aria-label="Fermer la table des matières"
            class="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-hoppr-green rounded-full p-1"
            @click="closeDrawer"
          >
            <Icon name="fa:close" size="1.25em" />
          </button>
        </div>
        <nav class="overflow-y-auto px-3 py-2 flex-1">
          <ul class="space-y-1">
            <li v-for="section in flatSections" :key="section.id">
              <button
                type="button"
                class="w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-hoppr-green"
                :class="[
                  section.depth >= 3 ? 'pl-7 text-zinc-600 dark:text-zinc-400' : 'font-semibold text-zinc-800 dark:text-zinc-200',
                  currentSectionId === section.id ? 'bg-hoppr-green/10 text-hoppr-green dark:text-hoppr-green' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800',
                ]"
                @click="scrollToSection(section.id)"
              >
                {{ section.text }}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </Transition>
  </div>
</template>
