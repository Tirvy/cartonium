import type { H3Event } from 'h3'
import { auth } from '#server/utils/auth'

/** App-facing user shape (compat with former Supabase user usages). */
export type AppUser = {
  id: string
  email?: string | null
  name?: string | null
  image?: string | null
  telegramId?: string | null
  telegramUsername?: string | null
  user_metadata: {
    telegram_id?: string | number
    full_name?: string
    first_name?: string
    avatar_url?: string
    picture?: string
    telegram_username?: string
  }
}

function toAppUser(sessionUser: {
  id: string
  email?: string | null
  name?: string | null
  image?: string | null
  telegramId?: string | null
  telegramUsername?: string | null
}): AppUser {
  const firstName = (sessionUser.name || '').split(' ')[0] || undefined
  return {
    id: sessionUser.id,
    email: sessionUser.email,
    name: sessionUser.name,
    image: sessionUser.image,
    telegramId: sessionUser.telegramId,
    telegramUsername: sessionUser.telegramUsername,
    user_metadata: {
      telegram_id: sessionUser.telegramId || undefined,
      full_name: sessionUser.name || undefined,
      first_name: firstName,
      avatar_url: sessionUser.image || undefined,
      picture: sessionUser.image || undefined,
      telegram_username: sessionUser.telegramUsername || undefined,
    },
  }
}

/** Require a Better Auth session; domain DB identity uses this user id. */
export default async function requireUser(event: H3Event): Promise<AppUser> {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'User not found' })
  }

  return toAppUser(session.user as Parameters<typeof toAppUser>[0])
}

export async function getOptionalUser(event: H3Event): Promise<AppUser | null> {
  const session = await auth.api.getSession({
    headers: event.headers,
  })
  if (!session?.user) {
    return null
  }
  return toAppUser(session.user as Parameters<typeof toAppUser>[0])
}
