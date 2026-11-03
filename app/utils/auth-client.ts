import { createAuthClient } from 'better-auth/vue'
import { telegramClient } from 'better-auth-telegram/client'

export const authClient = createAuthClient({
  plugins: [telegramClient()],
})
