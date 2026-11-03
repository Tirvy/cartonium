import { db } from '#server/db'
import { clubsInfo } from '#server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const [data] = await db
    .insert(clubsInfo)
    .values({
      club_id: body.club_id,
      text_html: body.text_html,
      text_delta: body.text_delta ?? {},
    })
    .onConflictDoUpdate({
      target: clubsInfo.club_id,
      set: {
        text_html: body.text_html,
        text_delta: body.text_delta ?? {},
      },
    })
    .returning()

  return data
})
