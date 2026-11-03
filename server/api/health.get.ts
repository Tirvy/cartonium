import { sql } from 'drizzle-orm'
import { db } from '#server/db'

export default defineEventHandler(async () => {
  try {
    await db.execute(sql`SELECT 1`)
    return { ok: true, db: 'up' }
  } catch (err) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Database unavailable',
      data: { ok: false, db: 'down', error: String(err) },
    })
  }
})
