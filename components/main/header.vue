<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import SearchBar from '@/components/blog/SearchBar.vue'
import LogoSvg from '@/components/logo/headerLogo.vue'
import type { SearchBarRef } from '@/components/blog/SearchBar.vue'

const route = useRoute()
const path = computed(() => route.fullPath.replace('/', ''))
const colorMode = useColorMode()

const isSearchActive = computed(() => !!route.query.search)

const showMenu = ref(false)
const toggleNav = () => (showMenu.value = !showMenu.value)
const closeMenu = () => (showMenu.value = false)

function onClick() {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
  closeMenu()
}

const menuItems = [
  { label: 'Accueil', to: '/', path: '' },
  { label: 'Tous nos Articles', to: '/blogs', path: 'blogs' },
  { label: 'Catégories', to: '/categories', path: 'categories' },
  { label: 'Tags', to: '/tags', path: 'tags' },
  { label: 'À Propos', to: 'https://www.hoppr.tech/', path: 'about' },
]

const searchBarRef = ref<SearchBarRef | null>(null)

function toggleSearch() {
  if (searchBarRef.value?.isExpanded)
    searchBarRef.value?.performSearch()
  else
    searchBarRef.value?.toggleSearch()
}
</script>

<template>
  <div>
    <div class="bg-hoppr-purple fixed top-0 left-0 right-0 z-1000">
      <nav class="container max-w-screen-xl px-6 py-2 mx-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <LogoSvg class="h-14 w-auto mr-4" />
            <div class="h-12 border-r border-gray-300 mx-4 mr-9" />
            <div class="flex flex-col">
              <router-link
                to="/"
                class="text-xl font-bold text-gray-100 md:text-2xl hover:text-hoppr-green font-orbitron mb-2"
              >
                HoppR Tech
              </router-link>
              <div class="hidden lg:flex lg:items-center mt-1">
                <ul class="flex space-x-4">
                  <li v-for="(item, index) in menuItems" :key="index" class="relative">
                    <NuxtLink
                      :to="item.to"
                      class="text-sm text-gray-100 hover:text-hoppr-green font-luciole font-lightest uppercase tracking-wider pb-1 transition-all duration-300 relative"
                      :class="{
                        'text-hoppr-green': (path === item.path && item.path !== 'about') || (item.path === 'blogs' && isSearchActive),
                      }" :target="item.path === 'about' ? '_blank' : '_self'"
                      :rel="item.path === 'about' ? 'noopener noreferrer' : ''"
                    >
                      {{ item.label }}
                      <span
                        class="absolute bottom-0 left-0 w-full h-0.5 bg-hoppr-green transform scale-x-0 transition-transform duration-300"
                        :class="{ 'scale-x-100': (path === item.path && item.path !== 'about') || (path === 'blogs' && isSearchActive) }"
                      />
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="hidden lg:flex lg:items-center space-x-4">
              <div class="relative">
                <SearchBar @close="() => {}" />
              </div>
              <ClientOnly>
                <button
                  v-if="colorMode.value === 'light'"
                  class="p-2 text-hoppr-green hover:text-hoppr-green rounded-full transition-colors duration-300 group"
                  aria-label="Activer le mode sombre" @click="onClick"
                >
                  <LazyIcon
                    name="mdi:weather-night" size="24"
                    class="transform transition-transform duration-300 group-hover:rotate-12"
                  />
                </button>
                <button
                  v-else
                  class="p-2 text-hoppr-green hover:text-hoppr-green rounded-full transition-colors duration-300 group"
                  aria-label="Activer le mode clair" @click="onClick"
                >
                  <LazyIcon
                    name="mdi:weather-sunny" size="24"
                    class="transform transition-transform duration-300 group-hover:rotate-12"
                  />
                </button>
              </ClientOnly>
            </div>
            <div class="lg:hidden">
              <button
                class="text-gray-100 focus:outline-none" aria-label="Ouvrir le menu de navigation"
                @click="toggleNav"
              >
                <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
                  <path
                    fill-rule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <!-- Menu mobile -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-full opacity-0" enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-full opacity-0"
    >
      <div v-if="showMenu" class="fixed top-0 left-0 right-0 bottom-0 bg-hoppr-purple z-50 lg:hidden">
        <div class="flex justify-end p-4">
          <button class="text-white" aria-label="Fermer le menu de navigation" @click="closeMenu">
            <LazyIcon name="mdi:close" size="24" />
          </button>
        </div>
        <ul class="flex flex-col mt-16 space-y-2 px-6 py-4">
          <li v-for="(item, index) in menuItems" :key="index">
            <NuxtLink
              :to="item.to" class="block py-2 text-gray-100 hover:text-hoppr-green uppercase tracking-wider"
              :class="{ 'text-hoppr-green font-bold': path === item.path && item.path !== 'about' }"
              :target="item.path === 'about' ? '_blank' : '_self'"
              :rel="item.path === 'about' ? 'noopener noreferrer' : ''" @click="closeMenu"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
          <li class="flex items-center justify-between py-2 uppercase tracking-wider relative">
            <div class="w-full relative">
              <span
                class="text-gray-100 cursor-pointer z-20 flex items-center justify-between w-full absolute inset-0"
                :class="{ 'opacity-0': searchBarRef?.isExpanded }"
                @click="toggleSearch"
              >
                Recherche
                <Icon name="mdi:magnify" size="24" class="text-gray-100" />
              </span>
              <div class="w-full" :class="{ 'opacity-0': !searchBarRef?.isExpanded }">
                <SearchBar ref="searchBarRef" @close="closeMenu" />
              </div>
            </div>
            <Icon
              v-if="searchBarRef?.isExpanded"
              name="mdi:magnify"
              size="24"
              class="text-gray-100 cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2"
              @click="toggleSearch"
            />
          </li>
          <li class="flex items-center justify-between py-2 uppercase tracking-wider" @click="onClick">
            <span class="text-gray-100">
              {{ colorMode.value === 'light' ? 'Passer au thème sombre' : 'Passer au thème clair' }}
            </span>
            <ClientOnly>
              <button
                class="p-2 text-white hover:text-hoppr-green rounded-full transition-colors duration-300 group"
                :aria-label="colorMode.value === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'"
              >
                <LazyIcon
                  :name="colorMode.value === 'light' ? 'mdi:weather-night' : 'mdi:weather-sunny'" size="20"
                  class="transform transition-transform duration-300 group-hover:rotate-12"
                />
              </button>
            </ClientOnly>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
