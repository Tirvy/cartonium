import { and, eq } from 'drizzle-orm'
import { db } from '#server/db'
import { profiles, profilesClubRights } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userid = query.userid as string
  const clubid = query.clubid as string
  if (!userid || !clubid) {
    return []
  }

  const [profile] = await db.select().from(profiles).where(eq(profiles.id, userid)).limit(1)
  if (!profile) {
    throw createError({ statusMessage: 'Profile not found' })
  }

  return db
    .select()
    .from(profilesClubRights)
    .where(and(eq(profilesClubRights.profile_id, userid), eq(profilesClubRights.club_id, clubid)))
})
