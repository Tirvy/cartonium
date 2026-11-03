<template>
  <div ref="telegramLoginButton"></div>
</template>

<script lang="ts" setup>
import { authClient } from '~/utils/auth-client'

const telegramLoginButton = ref<null | HTMLElement>(null)
const props = defineProps<{
  next?: string
}>()
const emit = defineEmits(['auth'])

let widget: { destroy?: () => void } | null = null

onMounted(async () => {
  const config = useRuntimeConfig()
  const botName = config.public.botLogin
  if (!telegramLoginButton.value || !botName) {
    return
  }

  // Ensure the div has an id for the Better Auth Telegram helper
  const elId = 'telegram-login-widget'
  telegramLoginButton.value.id = elId

  const route = useRoute()
  const nextRoute = props.next || route.fullPath || useDefaultPage().path

  widget = await authClient.initTelegramWidget(elId, { size: 'medium', userpic: false }, async (telegramData) => {
    const { data, error } = await authClient.signInWithTelegram(telegramData)
    if (error) {
      console.error('Telegram sign-in failed:', error)
      return
    }
    emit('auth', data)
    await navigateTo(nextRoute)
  })
})

onBeforeUnmount(() => {
  widget?.destroy?.()
})
</script>

<style scoped></style>
