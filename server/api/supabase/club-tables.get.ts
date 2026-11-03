import { eq } from 'drizzle-orm'
import { db } from '#server/db'
import { tables } from '#server/db/schema'
import { tablesFromSupabase } from '#server/transformers'

export default defineEventHandler(async (event): Promise<Table[]> => {
  const query = getQuery(event)
  const clubId = query.clubid as string

  if (!clubId) {
    throw createError({ statusMessage: 'Missing clubid' })
  }

  const data = await db.select().from(tables).where(eq(tables.club_id, clubId))
  return data.map(tablesFromSupabase)
})
