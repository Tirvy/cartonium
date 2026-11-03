import { db } from '#server/db'
import { clubsSettings } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const [data] = await db
    .insert(clubsSettings)
    .values(body)
    .onConflictDoUpdate({
      target: clubsSettings.club_id,
      set: body,
    })
    .returning()

  return data
})
