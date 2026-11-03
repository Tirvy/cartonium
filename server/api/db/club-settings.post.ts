import { db } from '#server/db'
import { clubsSettings } from '#server/db/schema'
import { requireClubGamemaster } from '#server/utils/require-rights'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await requireClubGamemaster(event, body.club_id)

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
