<script setup lang="ts">
import { ref } from 'vue'

const { path } = useRoute()
const articles = await queryContent(path).findOne()

// Trouver le premier lien qui a des enfants et n'ouvrir que celui-là
const firstLinkWithChildren = articles?.body?.toc?.links.find(link => link.children?.length > 0)
const expandedSections = ref<Set<string>>(new Set(
  firstLinkWithChildren ? [firstLinkWithChildren.id] : []
))

const links = computed(() => {
  const result: any[] = []
  articles?.body?.toc?.links.forEach((link) => {
    result.push(link)
    if (link.children && isExpanded(link.id))
      result.push(...link.children.map(child => ({ ...child, parent: link.id })))
  })
  return result
})

function toggleSection(id: string) {
  if (expandedSections.value.has(id))
    expandedSections.value.delete(id)
  else
    expandedSections.value.add(id)
}

const isExpanded = (id: string) => expandedSections.value.has(id)

const currentSection = ref<null | string>(null);
let observer: IntersectionObserver

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionHref = entry.target.querySelector('a')?.getAttribute('href')
        if (sectionHref) {

          currentSection.value = sectionHref

          // Update the TOC to highlight the corresponding link
          updateToc(sectionHref)
        }
      }
    })
  }, { threshold: 0.1, rootMargin: '-100px 0px -70% 0px' })

  // Observe the article sections
  document.querySelectorAll('.article-section h2, .article-section h3, .article-section h4').forEach((section) => {
    observer.observe(section)
  })
})

onUnmounted(() => {
  observer.disconnect()
})

function updateToc(sectionHref: string) {
  const tocLinks = document.querySelectorAll('#toc-content a');
  const currentLinkEndsWithSectionHref = ({ sectionHref, linkHref }: { sectionHref: string, linkHref: string }): boolean => {
    const regex = new RegExp(`^.*${sectionHref}$`);
    return regex.test(linkHref!)
  }

  // Trouver le lien actif et sa section parente
  let activeLink: Element | null = null;
  let activeParentId: string | null = null;

  tocLinks.forEach((link) => {
    link.classList.remove('active')
    const linkHref = link.getAttribute('href')

    if (linkHref && currentLinkEndsWithSectionHref({ linkHref, sectionHref })) {
      link.classList.add('active')
      activeLink = link

      // Trouver l'ID de la section parente si c'est un lien de niveau 3
      const parentId = link.getAttribute('data-parent')
      if (parentId) {
        activeParentId = parentId
      } else {
        // Si c'est un lien de niveau 2, son ID est l'ID parent
        activeParentId = link.getAttribute('id') || null
      }
    }
  })

  // Mettre à jour les sections ouvertes
  if (activeParentId) {
    // Fermer toutes les sections
    expandedSections.value.clear()
    // Ouvrir la section parente du lien actif
    expandedSections.value.add(activeParentId)
  }
}

</script>

<template>
  <div class="lg:col-span-3 sticky top-28 mt-5 h-96 hidden lg:block justify-self-end w-full" id="toc-container">
    <div class="border dark:border-zinc-500 p-4 rounded-md w-[250px] max-w-[350px] dark:bg-slate-900 shadow-md overflow-hidden">
      <h2 class="text-lg font-bold mb-4 border-b dark:border-zinc-500 pb-2 text-hoppr-green">
        Table des matières
      </h2>
      <div class="relative max-h-[calc(100vh-200px)] overflow-y-auto pr-2" id="toc-content">
        <div v-for="(link, index) in links" :key="link.id" class="flex items-start relative" :class="{
          'mb-4': link.depth === 2,
          'mb-2': link.depth === 3 && isExpanded(link.parent),
        }">
          <div class="w-6 flex-shrink-0 flex items-center justify-center">
            <button v-if="link.depth === 2"
              class="text-hoppr-green hover:text-opacity-80 transition-colors duration-200 w-full text-left"
              @click="toggleSection(link.id)">
              {{ link.children ? (isExpanded(link.id) ? '▾' : '▸') : '•' }}
            </button>
          </div>
          <div v-if="link.depth === 3 && isExpanded(link.parent)"
            class="absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-zinc-600" :style="{
              top: index > 0 && links[index - 1].depth === 2 ? '0' : '-4px',
              height: 'calc(100% + 8px)',
              left: '0.75rem',
            }" />
          <div v-if="link.depth === 3 && isExpanded(link.parent)" class="absolute w-2 h-px bg-gray-300 dark:bg-zinc-600"
            :style="{
              top: '0.9rem',
              left: '0.75rem',
            }" />
          <NuxtLink v-if="link.depth === 2 || (link.depth === 3 && isExpanded(link.parent))" :to="`#${link.id}`"
            class="block text-sm transition-colors duration-200 flex-grow" :class="{
              'font-semibold hover:text-hoppr-green': link.depth === 2,
              'text-gray-600 dark:text-gray-400 hover:text-hoppr-green dark:hover:text-hoppr-green': link.depth === 3,
              'ml-0': link.depth === 2,
              'ml-4': link.depth === 3,
            }"
            :id="link.depth === 2 ? link.id : undefined"
            :data-parent="link.depth === 3 ? link.parent : undefined"
          >
            {{ link.text }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.active {
  color: #00cca5 !important; /* hoppr-green */
  font-weight: 600;
}
</style>
