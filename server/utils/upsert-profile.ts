import { db } from '#server/db'
import { profiles } from '#server/db/schema'

export type AuthUserLike = {
  id: string
  name?: string | null
  image?: string | null
  telegramId?: string | null
  telegramUsername?: string | null
}

/** Map Better Auth user → `profiles` row (snake_case). Pure helper for tests. */
export function authUserToProfileValues(
  user: AuthUserLike,
  botName = process.env.NUXT_PUBLIC_BOT_LOGIN || '',
  now = new Date(),
) {
  const chatId = user.telegramId ? Number(user.telegramId) : 0
  return {
    id: user.id,
    updated_at: now,
    full_name: user.name || null,
    avatar_url: user.image || null,
    telegram_username: user.telegramUsername || null,
    bot_name: botName,
    chat_id: Number.isFinite(chatId) ? chatId : 0,
  }
}

/** Upsert app profile from Better Auth user (email or Telegram). */
export async function upsertProfileFromAuthUser(user: AuthUserLike) {
  const values = authUserToProfileValues(user)

  await db
    .insert(profiles)
    .values(values)
    .onConflictDoUpdate({
      target: profiles.id,
      set: {
        updated_at: values.updated_at,
        full_name: values.full_name,
        avatar_url: values.avatar_url,
        telegram_username: values.telegram_username,
        bot_name: values.bot_name,
        chat_id: values.chat_id,
      },
    })
}

export default upsertProfileFromAuthUser
