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
    }
  },

  modules: [
    '@nuxtjs/supabase',
    'dayjs-nuxt',
    '@nuxtjs/i18n',
    'vuetify-nuxt-module',
    'nuxt-translation-manager',
  ],
  'translation-manager': {
    langDir: 'i18n/locales',
  },
  i18n: {
    defaultLocale: 'ru',
    detectBrowserLanguage: {
      fallbackLocale: 'en',
    },
    locales: [
      { code: 'en', name: 'English', file: 'en.json', language: 'en-US' },
      { code: 'ru', name: 'Русский', file: 'ru.json', language: 'ru-RU' },
      // { code: 'ka', name: 'ქართული', file: 'ka.json', language: 'ka-GE'},
    ]
  },
  dayjs: {
    plugins: ['weekday'],
    locales: ['ru'],
    defaultLocale: 'ru',
  },
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

  nitro: {
    experimental: {
      tasks: true
    },
    scheduledTasks: {
      // Running `telegram messages` task every minute
      // '* * * * *': ['telegram:send-messages']
    }
  },

  runtimeConfig: {
    public: {
      botLogin: '',
    }
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
    // ssr: false,
  },

  compatibilityDate: '2024-10-24',
})