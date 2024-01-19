import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(TiptapVuetifyPlugin, {
    // Below is an IMPORTANT line.
    vuetify: nuxtApp.vueApp.vuetify,
    iconsGroup: 'mdi'
  })
})