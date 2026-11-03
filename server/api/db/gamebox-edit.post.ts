import { eq } from 'drizzle-orm'
import { db } from '#server/db'
import { gameboxes } from '#server/db/schema'
import { gameBoxToDb } from '#server/transformers'
import { requireGlobalAdmin } from '#server/utils/require-rights'

export default defineEventHandler(async (event) => {
  await requireGlobalAdmin(event)
  const body = await readBody(event)
  const gamebox = body.gamebox
  const gameboxesFormattedForBd = gameBoxToDb(gamebox)

  const data = await db
    .update(gameboxes)
    .set(gameboxesFormattedForBd as typeof gameboxes.$inferInsert)
    .where(eq(gameboxes.id, gamebox.id))
    .returning()

  return data
})
