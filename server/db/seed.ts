/**
 * Idempotent seed for local/dev: default club `terra` + optional admin.
 *
 * Env:
 *   SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD — Better Auth email user + global/club rights
 *   SEED_ADMIN_TELEGRAM_ID — optional telegram id stored on profile/user
 *   SEED_CLUB_URL_NAME — default `terra`
 */
import 'dotenv/config'
import { eq } from 'drizzle-orm'
import { hashPassword } from 'better-auth/crypto'
import { db } from './index'
import {
  account,
  clubs,
  clubsInfo,
  clubsSettings,
  profiles,
  profilesClubRights,
  user,
} from './schema'

const clubUrl = process.env.SEED_CLUB_URL_NAME || 'terra'
const clubTitle = process.env.SEED_CLUB_TITLE || 'Terra'

async function seedClub() {
  const [existing] = await db.select().from(clubs).where(eq(clubs.url_name, clubUrl)).limit(1)
  if (existing) {
    console.log(`Club ${clubUrl} already exists (${existing.id})`)
    return existing
  }

  const [club] = await db
    .insert(clubs)
    .values({ title: clubTitle, url_name: clubUrl })
    .returning()

  if (!club) throw new Error('Failed to insert club')

  await db.insert(clubsSettings).values({
    club_id: club.id,
    avatar_url: `/club-avatars/${clubUrl}.png`,
    guest_can_reserve: true,
    guest_can_gather_own: true,
  })

  await db.insert(clubsInfo).values({
    club_id: club.id,
    text_html: `<p>Welcome to ${clubTitle}.</p>`,
    text_delta: {},
  })

  console.log(`Seeded club ${clubUrl} (${club.id})`)
  return club
}

async function seedAdmin(clubId: string) {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) {
    console.log('SEED_ADMIN_EMAIL/PASSWORD not set — skipping admin seed')
    return
  }

  const telegramId = process.env.SEED_ADMIN_TELEGRAM_ID || null
  const [existing] = await db.select().from(user).where(eq(user.email, email)).limit(1)

  let userId = existing?.id
  if (!userId) {
    userId = crypto.randomUUID()
    await db.insert(user).values({
      id: userId,
      name: email.split('@')[0] || 'Admin',
      email,
      emailVerified: true,
      telegramId,
    })

    const hashed = await hashPassword(password)
    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: 'credential',
      userId,
      password: hashed,
    })

    await db.insert(profiles).values({
      id: userId,
      full_name: email.split('@')[0] || 'Admin',
      chat_id: telegramId ? Number(telegramId) : 0,
      bot_name: process.env.NUXT_PUBLIC_BOT_LOGIN || '',
    })
    console.log(`Created admin user ${email} (${userId})`)
  } else {
    console.log(`Admin user ${email} already exists (${userId})`)
  }

  const [right] = await db
    .select()
    .from(profilesClubRights)
    .where(eq(profilesClubRights.profile_id, userId))
    .limit(1)

  if (!right) {
    await db.insert(profilesClubRights).values({
      relation_type: 'gamemaster',
      profile_id: userId,
      club_id: clubId,
    })
    console.log(`Granted gamemaster on club ${clubId}`)
  }
}

async function main() {
  const club = await seedClub()
  await seedAdmin(club.id)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
