<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const progress = ref(0)
let ticking = false

function updateProgress() {
  const doc = document.documentElement
  const scrolled = window.scrollY
  const scrollable = doc.scrollHeight - window.innerHeight
  progress.value = scrollable > 0 ? Math.min(100, (scrolled / scrollable) * 100) : 0
  ticking = false
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(updateProgress)
    ticking = true
  }
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none"
    aria-hidden="true"
  >
    <div
      class="h-full bg-hoppr-green transition-[width] duration-150 ease-out"
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>
