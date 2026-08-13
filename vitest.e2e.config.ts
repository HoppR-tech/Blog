import process from 'node:process'
import { defineConfig } from 'vitest/config'

// Nuxt's production server build is the subject under test. Vitest defaults
// NODE_ENV to "test", which enables Vite sourcemaps that conflict with the
// virtual Satori transform emitted by nuxt-og-image.
process.env.NODE_ENV = 'production'

export default defineConfig({
  test: {
    include: ['tests/e2e/**/*.e2e.ts'],
    fileParallelism: false,
    hookTimeout: 240_000,
    testTimeout: 60_000,
  },
})
