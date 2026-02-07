import { meetcostConfig } from './meetcost.config'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },

  srcDir: 'app',

  modules: ['@nuxt/ui', '@nuxt/devtools', '@nuxtjs/seo'],

  // @ts-expect-error - site config from nuxt-site-config (via @nuxtjs/seo)
  site: {
    url: meetcostConfig.siteUrl,
    name: meetcostConfig.appName,
    description: meetcostConfig.defaultDescription,
  },

  css: ['~/assets/css/main.css'],

  devtools: { enabled: false },

  typescript: {
    strict: true,
    // 'build' avoids vite-plugin-checker during dev (fixes ENOTEMPTY/ENOENT errors).
    // Run `yarn typecheck` for manual checks.
    typeCheck: 'build',
  },

  ssr: true,

  nitro: {
    preset: 'static',
  },

  routeRules: {
    '/': { prerender: true },
    '/calculate': { ssr: false },
    '/history': { ssr: false },
    '/share': { ssr: false },
    '/about': { prerender: true },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: meetcostConfig.appTitle,
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      meta: [
        {
          name: 'description',
          content: meetcostConfig.defaultDescription,
        },
      ],
    },
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },

  icon: {
    provider: 'none',
    clientBundle: {
      scan: {
        globInclude: ['app/**', 'node_modules/@nuxt/ui/dist/**'],
        globExclude: ['node_modules'],
      },
      icons: ['lucide:moon', 'lucide:sun', 'lucide:minus', 'lucide:plus'],
    },
  },
})
