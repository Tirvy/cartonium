import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins?.push(vuetify({ autoImport: true }))
      })
    }, '@nuxtjs/supabase'],
  imports: {
    dirs: ['types/*.ts'],
  },
  supabase: {
    redirectOptions: {
      login: '/',
      callback: '/confirm',
      exclude: ['users/*'],
    },
  },
  runtimeConfig: {
    clubId: 2,
  },
  css: ['vuetify/lib/styles/main.sass'],
  build: {
    transpile: ['vuetify', 'tiptap-vuetify'],
  },
  typescript: {
    typeCheck: true,
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
