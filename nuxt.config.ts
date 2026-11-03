// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  devServer: {
    // port is important for telegram-bot login feature with local dev server
    host: '0.0.0.0',
    port: 80,
  },

  app: {
    head: {
      title: 'Cartonis',
    },
  },

  modules: ['dayjs-nuxt', '@nuxtjs/i18n', 'vuetify-nuxt-module', 'nuxt-translation-manager'],
  'translation-manager': {
    // for some reason it doesn't work with #shared/i18n/locales or in app/i18n/locales
    langDir: '../i18n/locales',
  },
  i18n: {
    defaultLocale: 'ru',
    detectBrowserLanguage: {
      fallbackLocale: 'en',
    },
    locales: [
      { code: 'en', name: 'English', file: 'en.json', language: 'en-US' },
      { code: 'ru', name: 'Русский', file: 'ru.json', language: 'ru-RU' },
    ],
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
  dayjs: {
    plugins: ['weekday'],
    locales: ['ru'],
    defaultLocale: 'ru',
  },
  imports: {
    dirs: ['types/*.ts'],
  },

  sourcemap: false,
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      // '* * * * *': ['telegram:send-messages']
    },
  },

  runtimeConfig: {
    public: {
      botLogin: '',
      siteUrl: '',
    },
  },

  typescript: {
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

  compatibilityDate: '2024-10-24',
})
