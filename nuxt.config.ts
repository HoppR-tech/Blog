// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-31',

  ssr: true,

  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=device-width,initial-scale=1',
      title: 'HoppR Blog',
      titleTemplate: '%s | HoppR Blog',
      meta: [{ name: 'description', content: 'Blog Tech HoppR' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  build: {
    transpile: ['vue-sonner', 'shiki'],
  },

  css: ['~/assets/css/tailwind.css'],

  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss': {},
      'autoprefixer': {},
      ...(import.meta.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
    },
  },

  purgecss: {
    enabled: true,
    safelist: [/nuxt-devtools-./],
  },

  icon: {
    size: '24px',
    class: 'icon',
  },

  sitemap: {
    strictNuxtContentPaths: true,
  },
  site: {
    url: import.meta.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://blog.hoppr.tech',
    identity: {
      type: 'Company',
    },
    twitter: '@HoppR_Tech',
  },

  typescript: {
    strict: true,
  },

  nitro: {
    firebase: {
      gen: 2,
      httpsOptions: {
        region: 'europe-west1',
        maxInstances: 3,
      },
      nodeVersion: '20'
    },
    preset: 'firebase',
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/rss.xml',
      ],
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
    preference: 'dark',
    fallback: 'light',
  },

  runtimeConfig: {
    public: {
      baseUrl: import.meta.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://blog.hoppr.tech',
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
    'nuxt-icon',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'nuxt-content-assets', // make sure to add before @nuxt/content !
    '@nuxt/content',
    '@nuxtjs/robots',
    '@nuxtjs/fontaine',
    '@nuxtjs/color-mode',
    'nuxt-simple-sitemap',
    '@nuxtjs/tailwindcss',
    'nuxt-purgecss',
    '@nuxt/devtools',
    ...(import.meta.env.NODE_ENV === 'test' ? ['@nuxt/test-utils/module'] : []),
  ],

  content: {
    highlight: {
      theme: 'github-dark',
    },
  },

  contentAssets: {
    // contentExtensions: 'mdx? csv',
    debug: false,
  },
})
