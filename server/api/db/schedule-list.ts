import { eq } from 'drizzle-orm'
import { db } from '#server/db'
import { userSchedules } from '#server/db/schema'
import { scheduleFromDb } from '#server/transformers'
import type { Schedule } from '#shared/types/frontend'
import requireUser from '#server/utils/require-user'

export default defineEventHandler(async (event): Promise<Schedule[]> => {
  const user = await requireUser(event)

  const schedules = await db.select().from(userSchedules).where(eq(userSchedules.owner_id, user.id))
  return schedules.map(scheduleFromDb)
})
