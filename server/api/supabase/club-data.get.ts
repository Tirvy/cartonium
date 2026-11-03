import { eq } from 'drizzle-orm'
import { db } from '#server/db'
import { clubs, clubsSettings } from '#server/db/schema'
import { clubFromSupabase } from '#server/transformers'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const clubname = query.clubname as string

  const [clubData] = await db.select().from(clubs).where(eq(clubs.url_name, clubname)).limit(1)
  if (!clubData) {
    throw createError({ statusMessage: 'Club not found' })
  }

  const [clubSettings] = await db
    .select()
    .from(clubsSettings)
    .where(eq(clubsSettings.club_id, clubData.id))
    .limit(1)

  return clubFromSupabase(clubData, clubSettings || baseSettings)
})

const baseSettings = {
  themes: {},
  avatar_url: '',
  guest_can_gather_own: false,
  guest_can_reserve: false,
}
