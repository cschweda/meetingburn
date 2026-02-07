import { meetingburnConfig } from './meetcost.config'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },

  srcDir: 'app',

  modules: ['@nuxt/ui', '@nuxt/devtools', '@nuxtjs/seo'],

  site: {
    url: meetingburnConfig.siteUrl,
    name: meetingburnConfig.appName,
    description: meetingburnConfig.defaultDescription,
  },

  ogImage: {
    enabled: true,
    defaults: {
      component: 'OgImageStatic',
      props: {
        image: '/og-image.png',
      },
    },
  },

  css: ['~/assets/css/main.css'],

  devtools: { enabled: false },

  typescript: {
    strict: true,
    // Skip typeCheck during build: nuxt-site-config adds 'site' key not in NuxtConfig types.
    typeCheck: false,
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
      title: meetingburnConfig.appTitle,
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      meta: [
        {
          name: 'description',
          content: meetingburnConfig.defaultDescription,
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
