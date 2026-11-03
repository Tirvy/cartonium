import { db } from '#server/db'
import { profiles } from '#server/db/schema'

type AuthUserLike = {
  id: string
  name?: string | null
  image?: string | null
  telegramId?: string | null
  telegramUsername?: string | null
}

/** Upsert app profile from Better Auth user (email or Telegram). */
export async function upsertProfileFromAuthUser(user: AuthUserLike) {
  const chatId = user.telegramId ? Number(user.telegramId) : 0
  const values = {
    id: user.id,
    updated_at: new Date(),
    full_name: user.name || null,
    avatar_url: user.image || null,
    telegram_username: user.telegramUsername || null,
    bot_name: process.env.NUXT_PUBLIC_BOT_LOGIN || '',
    chat_id: Number.isFinite(chatId) ? chatId : 0,
  }

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
