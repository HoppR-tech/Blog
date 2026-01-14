<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Récupération des données de l'article
const { path } = useRoute()
const articles = await queryContent(path).findOne()

// État du TOC
const currentSection = ref<null | string>(null)
const visibleSections = ref<Map<string, number>>(new Map())
let observer: IntersectionObserver | undefined
let mediaQuery: MediaQueryList | undefined
let handleScreenChange: ((e: MediaQueryListEvent | MediaQueryList) => void) | undefined
let initTimeout: NodeJS.Timeout | undefined

// Gestion des sections ouvertes/fermées
const firstLinkWithChildren = articles?.body?.toc?.links.find(link => link.children && link.children.length > 0)
const expandedSections = ref<Set<string>>(new Set(
  firstLinkWithChildren ? [firstLinkWithChildren.id] : []
))

/**
 * Vérifie si une section est actuellement ouverte
 */
const isExpanded = (id: string): boolean => expandedSections.value.has(id)

/**
 * Ouvre ou ferme une section du TOC
 */
function toggleSection(id: string): void {
  if (expandedSections.value.has(id))
    expandedSections.value.delete(id)
  else
    expandedSections.value.add(id)
}

/**
 * Calcule les liens à afficher dans le TOC en fonction des sections ouvertes
 */
const links = computed(() => {
  const result: any[] = []
  articles?.body?.toc?.links.forEach((link) => {
    result.push(link)
    if (link.children && isExpanded(link.id))
      result.push(...link.children.map(child => ({ ...child, parent: link.id })))
  })
  return result
})

/**
 * Trouve la section la plus visible parmi celles observées
 */
function findMostVisibleSection(): string | null {
  if (visibleSections.value.size === 0) return null

  let maxRatio = 0
  let mostVisibleSectionId = ''

  visibleSections.value.forEach((ratio, sectionId) => {
    if (ratio > maxRatio) {
      maxRatio = ratio
      mostVisibleSectionId = sectionId
    }
  })

  return mostVisibleSectionId || null
}

/**
 * Met à jour les sections visibles en fonction des entrées de l'IntersectionObserver
 */
function updateVisibleSections(entries: IntersectionObserverEntry[]): void {
  entries.forEach((entry) => {
    const sectionId = entry.target.id
    if (sectionId) {
      if (entry.isIntersecting) {
        visibleSections.value.set(sectionId, entry.intersectionRatio)
      } else {
        visibleSections.value.delete(sectionId)
      }
    }
  })
}

/**
 * Initialise l'observateur d'intersection pour suivre les sections visibles
 */
function initIntersectionObserver(): void {
  observer = new IntersectionObserver((entries) => {
    // Mettre à jour les sections visibles
    updateVisibleSections(entries)

    // Trouver la section la plus visible
    const mostVisibleSectionId = findMostVisibleSection()

    if (mostVisibleSectionId) {
      const sectionHref = `#${mostVisibleSectionId}`
      if (currentSection.value !== sectionHref) {
        currentSection.value = sectionHref

        // Mettre à jour le TOC pour mettre en évidence le lien correspondant
        updateToc(sectionHref)
      }
    }
  }, {
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    rootMargin: '-100px 0px -300px 0px'
  })
}

/**
 * Observe les sections de l'article pour détecter lesquelles sont visibles
 */
function observeArticleSections(): void {
  const sections = document.querySelectorAll('.article-section h2[id], .article-section h3[id], .article-section h4[id]')
  console.log('Sections trouvées:', sections.length)

  sections.forEach((section) => {
    if (observer) observer.observe(section)
  })

  // Si aucune section n'a été trouvée avec des IDs, essayer sans le sélecteur d'ID
  if (sections.length === 0) {
    document.querySelectorAll('.article-section h2, .article-section h3, .article-section h4').forEach((section) => {
      console.log('Section sans ID:', section.textContent)
      if (observer) observer.observe(section)
    })
  }
}

onMounted(() => {
  // Attendre que le DOM soit complètement chargé
  initTimeout = setTimeout(() => {
    // Initialiser seulement sur desktop (>= 1024px) car le TOC est caché sur mobile
    // Tailwind lg breakpoint = 1024px
    mediaQuery = window.matchMedia('(min-width: 1024px)')
    
    handleScreenChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        if (!observer) {
          initIntersectionObserver()
          observeArticleSections()
        }
      } else {
        if (observer) {
          observer.disconnect()
          observer = undefined
        }
      }
    }
    
    // Vérification initiale
    handleScreenChange(mediaQuery)
    
    // Écouter les changements
    mediaQuery.addEventListener('change', handleScreenChange)
  }, 500)
})

onUnmounted(() => {
  clearTimeout(initTimeout)
  if (mediaQuery && handleScreenChange) {
    mediaQuery.removeEventListener('change', handleScreenChange)
  }
  if (observer) observer.disconnect()
})



/**
 * Extrait l'ancre d'une URL (la partie après #)
 */
function extractAnchor(url: string | null): string | null {
  if (!url) return null
  return url.includes('#') ? '#' + url.split('#')[1] : url
}

/**
 * Normalise un href de section pour s'assurer qu'il commence par #
 */
function normalizeHref(sectionHref: string): string {
  return sectionHref.startsWith('#') ? sectionHref : `#${sectionHref}`
}

/**
 * Trouve les liens de niveau 2 (titres principaux) dans le TOC
 */
function findLevel2Links(tocLinks: NodeListOf<Element>): Element[] {
  return Array.from(tocLinks).filter(link => {
    const href = link.getAttribute('href')
    if (!href) return false

    // Vérifier si c'est un lien de niveau 2 en regardant les classes
    const parentElement = link.closest('.flex.items-start.relative')
    if (!parentElement) return false

    const hasToggleButton = parentElement.querySelector('button') !== null
    const hasLevel3Class = link.classList.contains('ml-4')
    return hasToggleButton && !hasLevel3Class
  })
}

/**
 * Trouve les liens enfants d'un lien de niveau 2
 */
function findChildLinks(tocLinks: NodeListOf<Element>, parentId: string): Element[] {
  return Array.from(tocLinks).filter(childLink => {
    const childHref = childLink.getAttribute('href')
    if (!childHref) return false

    const childParentId = childLink.getAttribute('data-parent')
    return childParentId === parentId
  })
}

/**
 * Trouve une correspondance exacte entre un lien du TOC et une section
 */
function findExactMatch(tocLinks: NodeListOf<Element>, sectionHref: string): { link: Element, parentId: string } | null {
  for (const link of tocLinks) {
    const linkHref = link.getAttribute('href')
    if (!linkHref) continue

    const linkAnchor = extractAnchor(linkHref)
    const linkId = linkAnchor?.substring(1) // Sans le #

    if (linkAnchor === sectionHref) {
      console.log('Correspondance exacte trouvée:', linkHref)

      // Déterminer l'ID de la section parente
      const parentId = link.getAttribute('data-parent')
      if (parentId) {
        console.log('Parent ID (depuis data-parent):', parentId)
        return { link, parentId }
      } else if (linkId) {
        // Si c'est un lien de niveau 2, son ID est l'ID parent
        console.log('Parent ID (depuis linkId):', linkId)
        return { link, parentId: linkId }
      }
    }
  }

  return null
}

/**
 * Trouve une correspondance partielle dans les enfants des liens de niveau 2
 */
function findPartialMatch(tocLinks: NodeListOf<Element>, sectionHref: string): { link: Element, parentId: string } | null {
  const level2Links = findLevel2Links(tocLinks)
  console.log('Liens de niveau 2 trouvés:', level2Links.length)

  for (const link of level2Links) {
    const linkHref = link.getAttribute('href')
    if (!linkHref) continue

    const linkId = linkHref.includes('#') ? linkHref.split('#')[1] : ''

    // Trouver tous les liens enfants de ce lien de niveau 2
    const childLinks = findChildLinks(tocLinks, linkId)

    // Vérifier si l'un des enfants correspond à la section actuelle
    for (const childLink of childLinks) {
      const childHref = childLink.getAttribute('href')
      if (!childHref) continue

      const childAnchor = extractAnchor(childHref)

      if (childAnchor === sectionHref) {
        console.log('Correspondance trouvée dans les enfants:', childHref)
        return { link: childLink, parentId: linkId }
      }
    }
  }

  return null
}

/**
 * Trouve une correspondance par contenu entre un lien du TOC et une section
 */
function findContentMatch(tocLinks: NodeListOf<Element>, sectionId: string): { link: Element, parentId: string } | null {
  // Trouver la section dans le document
  const section = document.getElementById(sectionId)
  if (!section) return null

  const sectionText = section.textContent?.trim()
  console.log('Texte de la section:', sectionText)

  // Chercher un lien dans le TOC avec un texte similaire
  for (const link of tocLinks) {
    const linkText = link.textContent?.trim()
    if (!linkText || !sectionText) continue

    if (linkText.includes(sectionText) || sectionText.includes(linkText)) {
      console.log('Correspondance par texte trouvée:', linkText)

      // Déterminer l'ID de la section parente
      const parentId = link.getAttribute('data-parent')
      if (parentId) {
        console.log('Parent ID (depuis data-parent):', parentId)
        return { link, parentId }
      } else {
        // Si c'est un lien de niveau 2, son ID est l'ID parent
        const linkHref = link.getAttribute('href')
        const linkId = linkHref?.includes('#') ? linkHref.split('#')[1] : ''
        if (linkId) {
          console.log('Parent ID (depuis linkId):', linkId)
          return { link, parentId: linkId }
        }
      }
    }
  }

  return null
}

/**
 * Met à jour le TOC en fonction de la section active
 */
function updateToc(sectionHref: string): void {
  console.log('Mise à jour du TOC pour:', sectionHref)

  // Normaliser le href de la section
  const normalizedHref = normalizeHref(sectionHref)
  const sectionId = normalizedHref.substring(1) // Sans le #

  // Récupérer tous les liens du TOC
  const tocLinks = document.querySelectorAll('#toc-content a')
  console.log('Nombre de liens dans le TOC:', tocLinks.length)

  // Retirer la classe active de tous les liens
  tocLinks.forEach(link => link.classList.remove('active'))

  // Variables pour stocker le lien actif et son parent
  let activeLink: Element | null = null
  let activeParentId: string | null = null

  // Stratégie 1: Chercher une correspondance exacte
  const exactMatch = findExactMatch(tocLinks, normalizedHref)
  if (exactMatch) {
    activeLink = exactMatch.link
    activeParentId = exactMatch.parentId
    activeLink.classList.add('active')
  }
  // Stratégie 2: Chercher une correspondance partielle
  else {
    const partialMatch = findPartialMatch(tocLinks, normalizedHref)
    if (partialMatch) {
      activeLink = partialMatch.link
      activeParentId = partialMatch.parentId
      activeLink.classList.add('active')
    }
    // Stratégie 3: Chercher une correspondance par contenu
    else {
      const contentMatch = findContentMatch(tocLinks, sectionId)
      if (contentMatch) {
        activeLink = contentMatch.link
        activeParentId = contentMatch.parentId
        activeLink.classList.add('active')
      }
    }
  }

  // Mettre à jour les sections ouvertes en fonction du lien actif
  updateExpandedSections(activeParentId, sectionId)
}

/**
 * Trouve le titre de niveau 2 le plus proche d'une section
 */
function findClosestHeading(sectionId: string): string | null {
  const sectionElement = document.getElementById(sectionId)
  if (!sectionElement) return null

  // Remonter dans le DOM pour trouver le titre de niveau 2 le plus proche
  let currentElement = sectionElement

  while (currentElement && currentElement.tagName !== 'BODY') {
    // Remonter au parent précédent
    currentElement = currentElement.previousElementSibling as HTMLElement

    if (currentElement && (currentElement.tagName === 'H2' || currentElement.querySelector('h2'))) {
      // Trouver l'ID de ce titre
      const parentId = currentElement.id || currentElement.querySelector('h2')?.id

      if (parentId) {
        console.log('Parent trouvé en remontant le DOM:', parentId)
        return parentId
      }
    }
  }

  return null
}

/**
 * Trouve le lien de niveau 2 le plus proche d'une section par distance visuelle
 */
function findClosestLinkByDistance(level2Links: Element[], sectionId: string): string | null {
  const sectionElement = document.getElementById(sectionId)
  if (!sectionElement || level2Links.length === 0) return null

  let closestLink = level2Links[0]
  let minDistance = Infinity

  for (const link of level2Links) {
    const linkHref = link.getAttribute('href')
    if (!linkHref) continue

    const linkId = linkHref.includes('#') ? linkHref.split('#')[1] : ''
    const linkElement = document.getElementById(linkId)

    if (linkElement) {
      // Calculer la distance entre les éléments dans le DOM
      const distance = Math.abs(linkElement.getBoundingClientRect().top - sectionElement.getBoundingClientRect().top)

      if (distance < minDistance) {
        minDistance = distance
        closestLink = link
      }
    }
  }

  const closestLinkHref = closestLink.getAttribute('href')
  if (!closestLinkHref) return null

  const closestLinkId = closestLinkHref.includes('#') ? closestLinkHref.split('#')[1] : ''
  if (closestLinkId) {
    console.log('Section la plus proche trouvée:', closestLinkId)
    return closestLinkId
  }

  return null
}

/**
 * Met à jour les sections ouvertes en fonction du lien actif ou de la section active
 */
function updateExpandedSections(activeParentId: string | null, sectionId: string): void {
  if (activeParentId) {
    console.log('Ouverture de la section:', activeParentId)
    expandedSections.value.clear()
    expandedSections.value.add(activeParentId)
    return
  }

  console.log('Aucun parent trouvé pour la section:', sectionId)

  // Stratégie 1: Trouver le titre de niveau 2 le plus proche
  const closestHeadingId = findClosestHeading(sectionId)
  if (closestHeadingId) {
    expandedSections.value.clear()
    expandedSections.value.add(closestHeadingId)
    return
  }

  // Stratégie 2: Trouver le lien de niveau 2 le plus proche par distance visuelle
  const tocLinks = document.querySelectorAll('#toc-content a')
  const level2Links = findLevel2Links(tocLinks)

  const closestLinkId = findClosestLinkByDistance(level2Links, sectionId)
  if (closestLinkId) {
    expandedSections.value.clear()
    expandedSections.value.add(closestLinkId)
    return
  }

  // Stratégie 3: Ouvrir la première section si aucune autre stratégie n'a fonctionné
  if (level2Links.length > 0) {
    const firstLink = level2Links[0]
    const firstLinkHref = firstLink.getAttribute('href')
    if (firstLinkHref) {
      const firstLinkId = firstLinkHref.includes('#') ? firstLinkHref.split('#')[1] : ''
      if (firstLinkId) {
        console.log('Ouverture de la première section par défaut:', firstLinkId)
        expandedSections.value.clear()
        expandedSections.value.add(firstLinkId)
      }
    }
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
/**
 * Style pour les liens actifs dans le TOC
 * Utilise la couleur verte de la charte graphique
 */
.active {
  color: #00cca5 !important; /* hoppr-green */
  font-weight: 600;
}
</style>
