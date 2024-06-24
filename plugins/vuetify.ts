import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import type { ThemeDefinition } from 'vuetify';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDateInput } from 'vuetify/labs/VDateInput'

import DayJsAdapter  from '@date-io/dayjs'
import ruDayjs from 'dayjs/locale/ru'
import enDayjs from 'dayjs/locale/en'

import { ru } from 'vuetify/locale'

const themeInitialDark: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#009688',
  },
}

const themeInitialLight: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#944a00',
    secondary: '#755845',
    accent: '#5f6135',
    error: '#ba1a1a',
    warning: '#009688',
    info: '#4caf50',
    success: '#8bc34a',
    background: '#fffbff',
    surface: '#fffbff',
    outline: '#84746a',
  }
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components: {
      ...components,
      VDateInput,
    },
    directives,
    theme: {
      defaultTheme: 'themeInitialLight',
      themes: {
        themeInitialDark,
        themeInitialLight
      }
    },
    date: {
      adapter: DayJsAdapter,
      locale: {
        ru: ruDayjs,
        en: enDayjs,
      },
    },
    defaults: {
      VBtn: {
        color: 'primary',
        variant: 'outlined',
      },
    },
    locale: {
      locale: 'ru',
      messages: { ru },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
