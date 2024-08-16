<script setup lang="ts">
import { computed, ref } from 'vue'
import SearchBar from '~/components/blog/SearchBar.vue'
import LogoSvg from '~/components/logo/headerLogo.vue'

const route = useRoute()
const path = computed(() => route.fullPath.replace('/', ''))
const colorMode = useColorMode()

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
  { label: 'À Propos', to: 'https://www.hoppr.tech/', path: 'about' },
]

const searchBarRef = ref<{ toggleSearch: () => void } | null>(null)

function toggleSearch() {
  searchBarRef.value?.toggleSearch()
}
</script>

<template>
  <div>
    <div class="bg-hoppr-purple fixed top-0 left-0 right-0 z-50">
      <nav class="container px-6 py-2 mx-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <LogoSvg class="h-14 w-auto mr-4" />
            <div class="h-12 border-r border-gray-300 mx-4 mr-9" />
            <div class="flex flex-col">
              <router-link to="/" class="text-xl font-bold text-gray-100 md:text-2xl hover:text-hoppr-green">
                HoppR Tech
              </router-link>
              <div class="hidden md:flex md:items-center mt-1">
                <ul class="flex space-x-4">
                  <li v-for="(item, index) in menuItems" :key="index">
                    <NuxtLink
                      :to="item.to" class="text-sm text-gray-100 hover:text-hoppr-green"
                      :class="{ 'text-hoppr-green font-semibold': path === item.path && item.path !== 'about' }"
                      :target="item.path === 'about' ? '_blank' : '_self'"
                      :rel="item.path === 'about' ? 'noopener noreferrer' : ''"
                    >
                      {{ item.label }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="hidden md:flex items-center space-x-4">
              <SearchBar @close="() => {}" />
              <ClientOnly>
                <button
                  v-if="colorMode.value === 'light'" class="text-gray-100 hover:text-indigo-400"
                  aria-label="Activer le mode sombre" @click="onClick"
                >
                  <Icon name="icon-park:moon" size="20" />
                </button>
                <button v-else class="text-gray-100 hover:text-indigo-400" aria-label="Activer le mode clair" @click="onClick">
                  <Icon name="noto:sun" size="20" />
                </button>
              </ClientOnly>
            </div>
            <div class="md:hidden">
              <button class="text-gray-100 focus:outline-none" @click="toggleNav">
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
      <div v-if="showMenu" class="fixed top-0 left-0 right-0 bottom-0 bg-hoppr-purple z-50 md:hidden">
        <div class="flex justify-end p-4">
          <button class="text-white" @click="closeMenu">
            <Icon name="mdi:close" size="24" />
          </button>
        </div>
        <ul class="flex flex-col mt-16 space-y-2 px-6 py-4">
          <li v-for="(item, index) in menuItems" :key="index">
            <NuxtLink
              :to="item.to" class="block py-2 text-gray-100 hover:text-hoppr-green"
              :class="{ 'text-hoppr-green font-semibold': path === item.path && item.path !== 'about' }"
              :target="item.path === 'about' ? '_blank' : '_self'"
              :rel="item.path === 'about' ? 'noopener noreferrer' : ''" @click="closeMenu"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
          <li class="flex items-center justify-between py-2" @click="toggleSearch">
            <span class="text-gray-100 cursor-pointer">Recherche</span>
            <SearchBar ref="searchBarRef" @close="closeMenu" />
          </li>
          <li class="flex items-center justify-between py-2" @click="onClick">
            <span class="text-gray-100">Thème</span>
            <ClientOnly>
              <button
                class="p-2 text-gray-100 bg-indigo-700 rounded-full hover:bg-indigo-600"
                :aria-label="colorMode.value === 'light' ? 'Mode sombre' : 'Mode clair'"
              >
                <Icon :name="colorMode.value === 'light' ? 'icon-park:moon' : 'noto:sun'" size="20" />
              </button>
            </ClientOnly>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
