import { db } from '#server/db'
import { tables } from '#server/db/schema'
import { requireClubGamemaster } from '#server/utils/require-rights'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await requireClubGamemaster(event, body.club_id)

  let data
  if (body.id) {
    ;[data] = await db
      .insert(tables)
      .values(body)
      .onConflictDoUpdate({
        target: tables.id,
        set: {
          club_id: body.club_id,
          title: body.title,
          description: body.description,
          people_max: body.people_max,
        },
      })
      .returning()
  } else {
    ;[data] = await db.insert(tables).values(body).returning()
  }

  return data ? [data] : []
})
