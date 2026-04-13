import { mock } from 'bun:test'

/**
 * Shape of a single meta entry passed to useHead.
 */
interface MetaEntry {
  property?: string
  name?: string
  content?: string
}

/**
 * Shape of a single link entry passed to useHead.
 */
interface LinkEntry {
  rel?: string
  href?: string
}

/**
 * Shape of a single script entry passed to useHead.
 */
interface ScriptEntry {
  type?: string
  innerHTML?: string
}

/**
 * Shape of the head config object passed to useHead by usePageSeo.
 */
export interface HeadConfig {
  title?: string
  meta: MetaEntry[]
  link: LinkEntry[]
  script: ScriptEntry[]
}

/**
 * Type for the useHead mock function that accepts a HeadConfig argument.
 */
export type UseHeadFn = (config: HeadConfig) => void

/**
 * Type for the useRuntimeConfig mock function.
 */
export type UseRuntimeConfigFn = () => { public: { baseUrl: string } }

/**
 * Creates properly typed mocks for useRuntimeConfig and useHead,
 * and assigns them to globalThis.
 */
export function setupSeoMocks(baseUrl = 'https://blog.hoppr.tech') {
  const mockUseRuntimeConfig = mock<UseRuntimeConfigFn>(() => ({
    public: { baseUrl },
  }))

  const mockUseHead = mock<UseHeadFn>(() => {})

  const g = globalThis as unknown as GlobalWithNuxtMocks
  g.useRuntimeConfig = mockUseRuntimeConfig
  g.useHead = mockUseHead

  return { mockUseRuntimeConfig, mockUseHead }
}

/**
 * Extracts the last call argument from mockUseHead.
 * Throws if useHead was never called.
 */
export function getLastHeadCall(mockUseHead: ReturnType<typeof mock<UseHeadFn>>): HeadConfig {
  const lastCall = mockUseHead.mock.lastCall
  if (!lastCall) {
    throw new Error('useHead was never called')
  }
  return lastCall[0]
}

/**
 * Type augmentation for globalThis to include Nuxt composable mocks.
 */
interface GlobalWithNuxtMocks {
  useRuntimeConfig: UseRuntimeConfigFn
  useHead: UseHeadFn
}
