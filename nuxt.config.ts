import { existsSync, readFileSync } from 'node:fs'

function getSecret(name: string, fallback: string = ''): string {
  try {
    const secretPath = `/run/secrets/${name}`
    if (existsSync(secretPath)) {
      return readFileSync(secretPath, 'utf-8').trim()
    }
  } catch (e) {
    // Ignore error
  }
  return process.env[name.toUpperCase()] || fallback
}

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
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css'
        },
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  build: {
    transpile: ['vue-sonner', 'shiki'],
  },

  css: ['~/assets/css/tailwind.css', '~/assets/css/katex.responsive.css'],

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
    safelist: [/nuxt-devtools-./, 'katex-display', 'katex'], // katex responsive fix classes
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
    preset: process.env.NITRO_PRESET || 'vercel',
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/rss.xml',
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
      apiKey: getSecret('notion_api_key', process.env.NUXT_NOTION_API_KEY),
      databasePostsId: '',
    },
    github: {
      owner: '',
      repo: '',
      branch: '',
      appId: '',
      privateKey: getSecret('github_private_key', process.env.NUXT_GITHUB_PRIVATE_KEY),
    },
    slack: {
      botToken: getSecret('slack_bot_token', process.env.NUXT_SLACK_BOT_TOKEN),
      channelId: '',
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
    ...(import.meta.env.NODE_ENV === 'test' ? ['@nuxt/test-utils/module'] : []),
  ],

  ogImage: {
    // Disable prerendering of OG images to avoid ultrahtml/satori-html crash in CI
    // Images will be generated at runtime instead
    runtimeCacheStorage: true,
  },

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
    markdown: {
      remarkPlugins: ['remark-math'],
      rehypePlugins: [
        ['rehype-katex', {
          // Configuration KaTeX
          throwOnError: false,
          output: 'html'
        }]
      ]
    }
  },

  contentAssets: {
    // contentExtensions: 'mdx? csv',
    debug: false,
  },
})
