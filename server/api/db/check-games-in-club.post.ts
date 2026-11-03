import { and, eq, inArray } from 'drizzle-orm'
import { db } from '#server/db'
import { clubsCollections } from '#server/db/schema'

export default defineEventHandler(async (event): Promise<number[]> => {
  const query = getQuery(event)
  const clubId = query.clubid as string
  const body = await readBody(event)
  const ids = body.ids as (string | number)[]
  if (!clubId) {
    throw createError({ statusMessage: 'clubId required' })
  }
  if (!ids || !ids.length) {
    return []
  }

  const numericIds = ids.map((id) => +id)
  const data = await db
    .select()
    .from(clubsCollections)
    .where(and(eq(clubsCollections.club_id, clubId), inArray(clubsCollections.game_box_id, numericIds)))

  return data.map((item) => item.game_box_id)
})
