import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const myCustomDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#009688',
  },
}

const myCustomWarnTheme: ThemeDefinition = {
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
    components,
    directives,
    theme: {
      defaultTheme: 'myCustomWarnTheme',
      themes: {
        myCustomDarkTheme,
        myCustomWarnTheme
      }
    },
    defaults: {
      VBtn: {
        color: 'primary',
        variant: 'outlined',
      },
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
