/**
 * One-shot: after importing Supabase domain data into local Postgres, backfill
 * Better Auth `user` + `account` rows from `profiles` so Telegram login keeps
 * the same ids (gatherings / rights / schedules stay linked).
 *
 * Usage (with DATABASE_URL set):
 *   npx tsx server/db/scripts/backfill-better-auth-from-profiles.ts
 */
import 'dotenv/config'
import { and, eq, gt } from 'drizzle-orm'
import { db } from '../index'
import { account, profiles, user } from '../schema'

async function main() {
  const withTelegram = await db.select().from(profiles).where(gt(profiles.chat_id, 0))

  let createdUsers = 0
  let createdAccounts = 0

  for (const profile of withTelegram) {
    const telegramId = String(profile.chat_id)
    const email = `${telegramId}@telegram.placeholder.invalid`
    const name = profile.full_name || profile.telegram_username || `tg_${telegramId}`

    const [existingUser] = await db.select().from(user).where(eq(user.id, profile.id)).limit(1)
    if (!existingUser) {
      await db.insert(user).values({
        id: profile.id,
        name,
        email,
        emailVerified: true,
        image: profile.avatar_url,
        telegramId,
        telegramUsername: profile.telegram_username,
      })
      createdUsers++
    } else {
      await db
        .update(user)
        .set({
          telegramId: existingUser.telegramId || telegramId,
          telegramUsername: existingUser.telegramUsername || profile.telegram_username,
          image: existingUser.image || profile.avatar_url,
        })
        .where(eq(user.id, profile.id))
    }

    const [existingTelegramAccount] = await db
      .select()
      .from(account)
      .where(and(eq(account.userId, profile.id), eq(account.providerId, 'telegram')))
      .limit(1)

    if (!existingTelegramAccount) {
      await db.insert(account).values({
        id: `tg_${profile.id}`,
        accountId: telegramId,
        providerId: 'telegram',
        userId: profile.id,
        telegramId,
        telegramUsername: profile.telegram_username,
      })
      createdAccounts++
    }
  }

  console.log(
    `Backfill done. profiles with telegram=${withTelegram.length}, users created=${createdUsers}, accounts created=${createdAccounts}`,
  )
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
