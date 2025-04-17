import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    environmentOptions: {
      nuxt: {
        dotenv: {
          fileName: '.env.test',
        },
        overrides: {
          // Your overrides here
        },
      },
    },
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  // define: {
  //   'import.meta.env.DEV': 'true',
  // },
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, '/'),
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '#imports': fileURLToPath(new URL('./node_modules/nuxt/dist/imports/runtime', import.meta.url)),
    },
  },
})
