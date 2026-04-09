import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-04-07',

  srcDir: '.',

  ssr: true,

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width,initial-scale=1',
      title: 'HoppR Blog',
      titleTemplate: '%s | HoppR',
      meta: [{ name: 'description', content: 'Blog Tech de HoppR' }],
      link: [
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css',
        },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
      script: [
        {
          'defer': true,
          'data-domain': 'blog.hoppr.tech',
          'src': 'https://analytics.hoppr.tech/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js',
        },
        {
          innerHTML: 'window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  build: {
    transpile: ['vue-sonner', 'shiki'],
  },

  vite: {
    optimizeDeps: {
      include: [],
    },
  },

  css: ['~/assets/css/tailwind.css', '~/assets/css/katex.responsive.css'],

  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss': {},
      'autoprefixer': {},
      ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
    },
  },

  purgecss: {
    enabled: true,
    safelist: [/nuxt-devtools-./, 'katex-display', 'katex'], // katex responsive fix classes
  },

  icon: {
    size: '24px',
    class: 'icon',
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/404'],
  },
  site: {
    url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://blog.hoppr.tech',
    identity: {
      type: 'Company',
    },
    twitter: '@HoppR_Tech',
  },

  typescript: {
    strict: true,
  },

  nitro: {
    preset: process.env.NITRO_PRESET || 'bun',
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/rss.xml',
        '/categories/craft',
        '/categories/cloud-platform',
        '/categories/architecture',
        '/categories/others',
      ],
      // Exclude OG image routes from prerendering to avoid ultrahtml/satori-html crash
      // Images will be generated at runtime when requested by social media crawlers
      ignore: ['/__og-image__/**'],
      // Allow build to continue despite OG image prerender failures
      // The images still work at runtime - this just skips prerendering them
      failOnError: false,
    },
    routeRules: {
      '/insights/**': {
        cache: {
          maxAge: 60 * 60 * 24 * 7, // 7 jours en secondes
        },
      },
      '/_nuxt/**': {
        cache: { maxAge: 60 * 60 * 24 * 365 }, // 1 an pour les assets générés par Nuxt
      },
      '/images/**': {
        cache: { maxAge: 60 * 60 * 24 * 30 }, // 30 jours pour les images
      },
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://blog.hoppr.tech',
      contactEmail: 'hello@hoppr.tech',
      contactName: 'HoppR',
    },
    notion: {
      apiKey: '',
      databasePostsId: '',
    },
    github: {
      owner: '',
      repo: '',
      branch: '',
      appId: '',
      privateKey: '',
    },
    slack: {
      botToken: '',
      channelId: '',
    },
  },

  modules: [
    '@nuxt/icon',
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@nuxt/content',
    '@nuxtjs/robots',
    '@nuxtjs/fontaine',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    ...(process.env.NODE_ENV === 'test' ? ['@nuxt/test-utils/module'] : []),
  ],

  ogImage: {
    runtimeCacheStorage: true,
    zeroRuntime: true,
  },

  mdc: {
    optimize: false,
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark',
          langs: [
            'bash',
            'shell',
            'powershell',
            'js',
            'ts',
            'python',
            'java',
            'c',
            'csharp',
            'go',
            'ruby',
            'php',
            'rust',
            'sql',
            'yaml',
            'json',
            'docker',
            'terraform',
            'tf',
            'html',
            'css',
            'groovy',
            'scala',
            'kotlin',
            'swift',
            'dart',
            'xml',
          ],
        },
        remarkPlugins: {
          'remark-math': {},
        },
        rehypePlugins: {
          'rehype-katex': {
            options: {
              throwOnError: false,
              output: 'html',
            },
          },
          [resolve(__dirname, 'content-plugins/rehype-content-assets.mjs')]: {},
          [resolve(__dirname, 'content-plugins/rehype-heading-shift.mjs')]: {},
        },
      },
    },
  },
})
