import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { telegram } from 'better-auth-telegram'
import { db } from '#server/db'
import * as schema from '#server/db/schema'

const botToken = process.env.NUXT_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || ''
const botUsername = (process.env.NUXT_PUBLIC_BOT_LOGIN || process.env.TELEGRAM_BOT_USERNAME || '').replace(
  /^@/,
  '',
)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    // Match UI registrationAvailable=false; set BETTER_AUTH_ALLOW_SIGNUP=true to open signup.
    disableSignUp: process.env.BETTER_AUTH_ALLOW_SIGNUP !== 'true',
  },
  baseURL: process.env.BETTER_AUTH_URL || process.env.NUXT_PUBLIC_SITE_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: (() => {
    const origins = new Set<string>()
    for (const raw of (process.env.BETTER_AUTH_TRUSTED_ORIGINS || '').split(',')) {
      const o = raw.trim()
      if (o) origins.add(o)
    }
    const site = process.env.NUXT_PUBLIC_SITE_URL?.trim()
    if (site) origins.add(site)
    return origins.size ? [...origins] : undefined
  })(),
  plugins: [
    telegram({
      botToken,
      botUsername,
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Lazy import to avoid circular init with db schema consumers
          const { upsertProfileFromAuthUser } = await import('#server/utils/upsert-profile')
          await upsertProfileFromAuthUser(user)
        },
      },
      update: {
        after: async (user) => {
          const { upsertProfileFromAuthUser } = await import('#server/utils/upsert-profile')
          await upsertProfileFromAuthUser(user)
        },
      },
    },
  },
})

export type Auth = typeof auth
