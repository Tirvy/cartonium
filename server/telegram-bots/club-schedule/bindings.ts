import { and, eq } from 'drizzle-orm'
import { db } from '#server/db'
import { clubs, telegramBotClubBindings } from '#server/db/schema'
import { BOT_NAME, type ClubBinding } from './types'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isClubId(value: string): boolean {
  return UUID_RE.test(value)
}

export async function getClubBinding(chatId: number): Promise<ClubBinding | null> {
  const [binding] = await db
    .select({ club_id: telegramBotClubBindings.club_id })
    .from(telegramBotClubBindings)
    .where(
      and(eq(telegramBotClubBindings.chat_id, chatId), eq(telegramBotClubBindings.bot_name, BOT_NAME)),
    )
    .limit(1)

  if (!binding?.club_id) {
    return null
  }

  const [club] = await db
    .select({ id: clubs.id, title: clubs.title, url_name: clubs.url_name })
    .from(clubs)
    .where(eq(clubs.id, binding.club_id))
    .limit(1)

  if (!club) {
    return null
  }

  return {
    chatId,
    clubId: club.id,
    clubTitle: club.title,
    clubUrlName: club.url_name,
  }
}

export async function setClubBinding(chatId: number, clubId: string): Promise<ClubBinding> {
  if (!isClubId(clubId)) {
    throw new Error('invalid_club_id')
  }

  const [club] = await db
    .select({ id: clubs.id, title: clubs.title, url_name: clubs.url_name })
    .from(clubs)
    .where(eq(clubs.id, clubId))
    .limit(1)

  if (!club) {
    throw new Error('club_not_found')
  }

  await db
    .insert(telegramBotClubBindings)
    .values({
      chat_id: chatId,
      bot_name: BOT_NAME,
      club_id: club.id,
      updated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: [telegramBotClubBindings.chat_id, telegramBotClubBindings.bot_name],
      set: {
        club_id: club.id,
        updated_at: new Date(),
      },
    })

  return {
    chatId,
    clubId: club.id,
    clubTitle: club.title,
    clubUrlName: club.url_name,
  }
}
