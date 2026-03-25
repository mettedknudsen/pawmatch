// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/eslint',
  ],
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    types: '~/types/database.types.ts'
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
})
