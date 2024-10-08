import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 80,
  },
  app: {
    head: {
      title: 'Cartonis',
    }
  },
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
    redirect: true,
    redirectOptions: {
      login: '/',
      callback: '/confirm',
      include: ['/clubs/*/information/edit', '/clubs(/*)/settings(/*)?', '/admin(/*)?'],
      exclude: ['users/*'],
      cookieRedirect: true,
    },
    cookieOptions: {
      secure: false
    }
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
