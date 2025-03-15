// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-31',

  ssr: true,

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width,initial-scale=1',
      title: 'HoppR Blog',
      titleTemplate: '%s | HoppR Blog',
      meta: [{ name: 'description', content: 'Blog Tech de HoppR' }],
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
    preset: 'vercel',
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
    storage: {
      data: { driver: 'vercelKV' },
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
    redis: {
      url: '',
      rest_api_url: '',
      rest_api_token: '',
      rest_api_read_only_token: '',
    },
  },

  modules: [
    'nuxt-icon',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'nuxt-content-assets', // Assurez-vous d'ajouter cela avant '@nuxt/content' !
    '@nuxt/content',
    '@nuxtjs/robots',
    '@nuxtjs/fontaine',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    'nuxt-purgecss',
    '@nuxt/devtools',
    '@nuxtjs/sitemap',
    '@formkit/auto-animate/nuxt',
    ...(import.meta.env.NODE_ENV === 'test' ? ['@nuxt/test-utils/module'] : []),
  ],

  content: {
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
  },

  contentAssets: {
    // contentExtensions: 'mdx? csv',
    debug: false,
  },
})
