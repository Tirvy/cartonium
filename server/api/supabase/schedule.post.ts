import { eq } from 'drizzle-orm'
import { db } from '#server/db'
import { userSchedules, userSchedulesHistory } from '#server/db/schema'
import requireUser from '#server/utils/require-user'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)

  let scheduleId = body.id

  if (!scheduleId) {
    const [created] = await db
      .insert(userSchedules)
      .values({
        title: body.title,
        archive: false,
        visibility: 'hidden',
        owner_id: user.id,
      })
      .returning()
    scheduleId = created?.id
  } else if (body.title) {
    await db
      .update(userSchedules)
      .set({ title: body.title })
      .where(eq(userSchedules.id, scheduleId))
  }

  const [historyRow] = await db
    .insert(userSchedulesHistory)
    .values({
      schedule_id: scheduleId,
      start_date: body.startDate,
      segment_size: 60,
      segments: body.segments,
    })
    .returning()

  if (!historyRow) {
    throw createError({ statusMessage: 'Failed to save schedule history' })
  }

  return scheduleId
})
