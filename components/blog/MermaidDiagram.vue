<script setup lang="ts">
import { nextTick, onMounted, ref, useId, watch } from 'vue'

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  error: [error: unknown]
}>()

// Wide diagrams shrink to fit the column, but never below this ratio: past it the labels
// become unreadable, so the diagram scrolls horizontally instead.
const MIN_SCALE = 0.6

const colorMode = useColorMode()
const svg = ref('')
const container = ref<HTMLDivElement>()
// Mermaid injects the id into the SVG and into scoped CSS selectors (#id .node),
// so it must be a valid, unique CSS identifier.
const baseId = `mermaid-${useId().replace(/[^\w-]/g, '')}`
let renderCount = 0

async function renderDiagram() {
  if (!import.meta.client)
    return

  try {
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: colorMode.value === 'dark' ? 'dark' : 'default',
      fontFamily: 'Luciole, sans-serif',
      // On a syntax error, throw instead of drawing Mermaid's error diagram: we fall back to the source.
      suppressErrorRendering: true,
    })
    // Labels are measured at render time: wait for the article font to avoid clipped text.
    await document.fonts?.ready
    // A fresh id per render so a theme switch never collides with the SVG currently displayed.
    const { svg: rendered } = await mermaid.render(`${baseId}-${++renderCount}`, props.code)
    svg.value = rendered

    await nextTick()
    const svgElement = container.value?.querySelector('svg')
    const naturalWidth = svgElement?.viewBox.baseVal?.width
    if (svgElement && naturalWidth)
      svgElement.style.minWidth = `${Math.round(naturalWidth * MIN_SCALE)}px`
  }
  catch (error) {
    console.warn('Mermaid diagram could not be rendered, falling back to source code.', error)
    emit('error', error)
  }
}

onMounted(renderDiagram)
watch(() => colorMode.value, renderDiagram)
</script>

<template>
  <figure class="mermaid-diagram not-prose my-6">
    <!-- eslint-disable-next-line vue/no-v-html -- SVG produced by Mermaid with securityLevel 'strict' (sanitized) -->
    <div v-if="svg" ref="container" class="overflow-x-auto [&_svg]:mx-auto [&_svg]:block" v-html="svg" />
    <div
      v-else
      class="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-zinc-300 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
      role="status"
    >
      Chargement du diagramme…
    </div>
  </figure>
</template>
