import type { ExternalVuetifyOptions } from 'vuetify-nuxt-module'
import type { ThemeDefinition } from 'vuetify';

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

export default {
  theme: {
    defaultTheme: 'themeInitialLight',
    themes: {
      themeInitialDark,
      themeInitialLight
    }
  },
  defaults: {
    VBtn: {
      color: 'primary',
      variant: 'outlined',
    },
  },
  locale: {
    locale: 'ru',
    fallback: 'en-GB',
  },
  localeMessages: ['ru', 'en'],
} satisfies ExternalVuetifyOptions