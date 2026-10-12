import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { afterAll, afterEach, mock } from 'bun:test'

/**
 * Prepares the current test file for mounting components: a browser-like DOM and
 * @vue/test-utils with auto-unmount after each test. Both are torn down after the file, so the
 * other suites keep Node's fetch/XMLHttpRequest (nock relies on them).
 * Vue's DOM renderer reads `document` when it is first evaluated: import Vue and components
 * dynamically, after this call.
 */
export async function setupComponentTests() {
  GlobalRegistrator.register()
  const testUtils = await import('@vue/test-utils')
  testUtils.enableAutoUnmount(afterEach)
  afterAll(async () => {
    // Bun shares loaded modules between test files: hand auto-unmount over to the next file.
    testUtils.disableAutoUnmount()
    await GlobalRegistrator.unregister()
  })
  return testUtils
}

export const DIAGRAM_NATURAL_WIDTH = 1000

/**
 * Replaces the `mermaid` package: `render` returns an SVG shaped like Mermaid's output
 * (natural size in the viewBox, `max-width` style). Make it reject to simulate a syntax error.
 */
export function mockMermaid() {
  const mermaid = {
    initialize: mock((_config: Record<string, unknown>) => {}),
    render: mock(async (id: string, _code: string) => ({
      svg: `<svg id="${id}" width="100%" viewBox="0 0 ${DIAGRAM_NATURAL_WIDTH} 200" style="max-width: ${DIAGRAM_NATURAL_WIDTH}px;"><g></g></svg>`,
    })),
  }
  mock.module('mermaid', () => ({ default: mermaid }))
  return mermaid
}

/** Stand-in for Nuxt's auto-imported `useColorMode()`; pass a Vue `reactive` object to drive it. */
export function mockColorMode(colorMode: { value: 'light' | 'dark' }) {
  ;(globalThis as any).useColorMode = () => colorMode
}

/** Lets the diagram finish its asynchronous render (lazy Mermaid import, render, DOM update). */
export async function waitForRender() {
  for (let i = 0; i < 5; i++)
    await new Promise(resolve => setTimeout(resolve, 0))
}
