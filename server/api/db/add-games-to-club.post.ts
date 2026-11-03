import { db } from '#server/db'
import { clubsCollections } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const query = getQuery(event)
  const clubId = query.clubid as string
  const gameBoxIds: Array<number> = body.gameBoxIds

  const dataToSend = gameBoxIds.map((gameBoxId) => ({
    game_box_id: gameBoxId,
    club_id: clubId,
  }))

  const data = await db
    .insert(clubsCollections)
    .values(dataToSend)
    .onConflictDoNothing({
      target: [clubsCollections.game_box_id, clubsCollections.club_id],
    })
    .returning()

  return data
})
