import { db } from '#server/db'
import { profiles } from '#server/db/schema'
import type { User } from '@supabase/auth-js'

/** Upsert app profile into local Postgres using Supabase Auth user id. */
export default async function upsertProfile(user: User, tgData: TelegramLoginPayload) {
  await db
    .insert(profiles)
    .values({
      id: user.id,
      updated_at: new Date(),
      full_name: [tgData.first_name, tgData.last_name].filter(Boolean).join(' '),
      avatar_url: tgData.photo_url,
      telegram_username: tgData.username,
      bot_name: process.env.NUXT_PUBLIC_BOT_LOGIN || '',
      chat_id: tgData.id,
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: {
        updated_at: new Date(),
        full_name: [tgData.first_name, tgData.last_name].filter(Boolean).join(' '),
        avatar_url: tgData.photo_url,
        telegram_username: tgData.username,
        bot_name: process.env.NUXT_PUBLIC_BOT_LOGIN || '',
        chat_id: tgData.id,
      },
    })
}
