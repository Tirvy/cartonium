import { db } from '#server/db'
import { gameboxes } from '#server/db/schema'
import { gameBoxToDb } from '#server/transformers'
import { requireGlobalAdmin } from '#server/utils/require-rights'

export default defineEventHandler(async (event) => {
  await requireGlobalAdmin(event)
  const gameboxesBody = await readBody(event)
  const gameboxesFormattedForBd = gameboxesBody.map(gameBoxToDb)

  // onConflict: alias_tesera — same temp fix as before [31.08.2024]
  const data = await db
    .insert(gameboxes)
    .values(gameboxesFormattedForBd as (typeof gameboxes.$inferInsert)[])
    .onConflictDoNothing({ target: gameboxes.alias_tesera })
    .returning()

  return data
})
