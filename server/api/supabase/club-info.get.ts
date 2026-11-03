import { eq } from 'drizzle-orm'
import { db } from '#server/db'
import { clubsInfo } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const clubId = query.clubid as string

  const [data] = await db.select().from(clubsInfo).where(eq(clubsInfo.club_id, clubId)).limit(1)
  if (!data) {
    throw createError({ statusMessage: 'Club info not found' })
  }

  return data
})
