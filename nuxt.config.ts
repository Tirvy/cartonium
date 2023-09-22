// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  supabase: {
    redirectOptions: {
      login: '/',
      callback: '/confirm',
      exclude: [],
    },
  },
  css: ['vuetify/lib/styles/main.sass'],
  build: {
    transpile: ['vuetify'],
  },
  typescript: {
    typeCheck: true,
  }
})
