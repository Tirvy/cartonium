import { and, asc, eq } from 'drizzle-orm'
import { db } from '#server/db'
import { userSchedules, userSchedulesHistory } from '#server/db/schema'
import { scheduleFromDb } from '#server/transformers'
import type { Schedule } from '#shared/types/frontend'
import requireUser from '#server/utils/require-user'

export default defineEventHandler(async (event): Promise<Schedule> => {
  const user = await requireUser(event)
  const id = +(getQuery(event).scheduleId as string)
  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid schedule id' })
  }

  const [schedule] = await db
    .select()
    .from(userSchedules)
    .where(and(eq(userSchedules.owner_id, user.id), eq(userSchedules.id, id)))
    .limit(1)

  if (!schedule) {
    throw createError({ statusCode: 404, statusMessage: 'Schedule not found' })
  }

  const history = await db
    .select()
    .from(userSchedulesHistory)
    .where(eq(userSchedulesHistory.schedule_id, id))
    .orderBy(asc(userSchedulesHistory.created_at))

  return scheduleFromDb({
    ...schedule,
    history,
  })
})
