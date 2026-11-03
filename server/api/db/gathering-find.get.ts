import { and, eq } from 'drizzle-orm'
import { db } from '#server/db'
import { gatherings } from '#server/db/schema'
import { gatheringFromDb } from '#server/transformers'
import type { Gathering } from '#shared/types/frontend'

export default defineEventHandler(async (event): Promise<Gathering> => {
  const query = getQuery(event)
  const clubid = query.clubid as string
  const gatheringid = query.gatheringid as string

  if (isNaN(+gatheringid)) {
    throw createError({ statusMessage: 'Gathering ID must be a number' })
  }

  const [data] = await db
    .select()
    .from(gatherings)
    .where(and(eq(gatherings.club_id, clubid), eq(gatherings.id, +gatheringid)))
    .limit(1)

  if (!data) {
    throw createError({ statusMessage: 'Gathering not found' })
  }

  return gatheringFromDb(data)
})
