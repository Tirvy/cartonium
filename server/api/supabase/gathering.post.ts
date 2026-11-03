import { db } from '#server/db'
import { gatherings, gatheringsGuests } from '#server/db/schema'
import { gatheringFromSupabase } from '#server/transformers'
import requireUser from '#server/utils/require-user'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const { with_host: _withHost, ...rest } = body

  const values = {
    ...rest,
    owner_id: rest.owner_id || user.id,
  }

  let data
  if (values.id) {
    ;[data] = await db
      .insert(gatherings)
      .values(values)
      .onConflictDoUpdate({
        target: gatherings.id,
        set: values,
      })
      .returning()
  } else {
    ;[data] = await db.insert(gatherings).values(values).returning()
  }

  if (!data) {
    throw createError({ statusMessage: 'Failed to save gathering' })
  }

  await db.insert(gatheringsGuests).values({
    gathering_id: data.id,
    user_id: user.id,
    guests_number: (+body.with_host || 0) + 1,
  })

  return gatheringFromSupabase(data)
})
