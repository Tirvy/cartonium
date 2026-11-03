import { and, arrayContains, desc, ilike } from 'drizzle-orm'
import { db } from '#server/db'
import { gameboxesWithClubId } from '#server/db/schema'
import type { GameBox } from '#shared/types/frontend.js'
import { gameBoxFromSupabase } from '#server/transformers.js'

export default defineEventHandler(async (event): Promise<GameBox[]> => {
  const query = getQuery(event)
  const clubId = query.clubid as string
  const search = (query.search as string) || ''
  const limit = +(query.limit as string) || 10000

  const conditions = [arrayContains(gameboxesWithClubId.club_id, [clubId])]
  if (search) {
    conditions.push(ilike(gameboxesWithClubId.title, `%${search}%`))
  }

  const data = await db
    .select()
    .from(gameboxesWithClubId)
    .where(and(...conditions))
    .orderBy(desc(gameboxesWithClubId.rating_bgg))
    .limit(limit)

  return data.map(gameBoxFromSupabase)
})
