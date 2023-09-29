import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const myCustomDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#009688',
  },
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'myCustomDarkTheme',
      themes: {
        myCustomDarkTheme
      }
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
