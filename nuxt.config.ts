import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
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
      secure: true
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
    // "have an 'override' modifier" error in supabase/auth-js @tirvy 10.24
    typeCheck: false,
  },

  vite: {
    vue: {
      template: {
        // hydrations errors @tirvy 10.24
        // but this needs for img imports in vuetify
        // transformAssetUrls,
      },
    },
  },

  $development: {
    supabase: {
      cookieOptions: {
        secure: false
      }
    },
  },

  compatibilityDate: '2024-10-24',
})