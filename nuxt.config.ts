// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  target: process.env.TARGET || 'server',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: !process.env.PRODUCTION },
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL
    }
  },
  modules: [
    '@nuxtjs/supabase',
    "@netlify/nuxt",
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/ui',
    '@yuta-inoue-ph/nuxt-vcalendar',
  ],
  ui: {
    colorMode: false
  },
  image: {
    format: ['webp'],
    domains: ['rlqzvlavdwokmnrsdygx.supabase.co'],
  },
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    types: '~/types/database.types.ts'
  },
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: [
        'temporal-polyfill',
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor',
      ]
    },
    nitro: {
      preset: 'netlify',
      externals: {
        external: ['@supabase/supabase-js']
      }
    },

    plugins: [
      tailwindcss(),
      svgLoader()
    ],
  },
})
