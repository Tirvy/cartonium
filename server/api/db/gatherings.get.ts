import { and, asc, eq, gte } from 'drizzle-orm'
import { db } from '#server/db'
import { gatheringsWithGuests } from '#server/db/schema'
import { gatheringWithGuestsFromDb } from '#server/transformers'
import type { GatheringWithGuests } from '#shared/types/frontend'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const clubid = query.clubid as string

  let startDate = ''
  if (query['date-from']) {
    startDate = query['date-from'] as string
  } else {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    startDate = today.toISOString()
  }

  const data = await db
    .select()
    .from(gatheringsWithGuests)
    .where(
      and(gte(gatheringsWithGuests.start_date, new Date(startDate)), eq(gatheringsWithGuests.club_id, clubid)),
    )
    .orderBy(asc(gatheringsWithGuests.start_date))

  return clampGatherings(data.map(gatheringWithGuestsFromDb))
})

function clampGatherings(gatheringsArray: GatheringWithGuests[]) {
  const hashed = gatheringsArray.reduce((acc: Record<number, GatheringWithGuests>, gathering) => {
    const foundItem = acc[gathering.id]
    if (foundItem) {
      foundItem.guests = [...foundItem.guests, ...gathering.guests]
      foundItem.slotsFilled = foundItem.guests.reduce((sum, item) => sum + item.totalGuests, 0)
    } else {
      acc[gathering.id] = { ...gathering }
    }
    return acc
  }, {})

  return Object.values(hashed)
}
