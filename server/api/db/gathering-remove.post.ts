import { eq, inArray } from 'drizzle-orm'
import { db } from '#server/db'
import { gatherings, gatheringsGuests, gatheringsWithGuests, profiles } from '#server/db/schema'
import telegramNotify from '#server/utils/telegram-notify'
import { requireGatheringOwnerOrClubAdmin } from '#server/utils/require-rights'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.gathering_id) {
    throw createError({ statusCode: 400, statusMessage: 'gathering_id required' })
  }

  const [gathering] = await db
    .select()
    .from(gatherings)
    .where(eq(gatherings.id, body.gathering_id))
    .limit(1)
  if (!gathering) {
    throw createError({ statusCode: 404, statusMessage: 'Gathering not found' })
  }

  await requireGatheringOwnerOrClubAdmin(event, gathering)

  const gatheringGuestsRows = await db
    .select()
    .from(gatheringsWithGuests)
    .where(eq(gatheringsWithGuests.id, body.gathering_id))

  const guestIds = [
    ...new Set(
      gatheringGuestsRows
        .filter((item) => item.user_id && item.guests_number && item.guests_number >= 1)
        .map((item) => item.user_id as string),
    ),
  ]

  const profileRows =
    guestIds.length > 0
      ? await db.select().from(profiles).where(inArray(profiles.id, guestIds))
      : []
  const chatByUser = new Map(profileRows.map((p) => [p.id, p.chat_id]))

  await db.delete(gatheringsGuests).where(eq(gatheringsGuests.gathering_id, body.gathering_id))
  await db.delete(gatherings).where(eq(gatherings.id, body.gathering_id))

  for (const item of gatheringGuestsRows) {
    if (!item.user_id || !item.guests_number || item.guests_number < 1) continue
    const chatId = chatByUser.get(item.user_id)
    if (!chatId) continue
    telegramNotify(event, {
      to: Number(chatId),
      bot_name: process.env.NUXT_PUBLIC_BOT_LOGIN,
      type: 'gathering-removed',
      why: `because i can`,
      what: getMessage(item),
    })
  }

  return []
})

function getMessage(gatheringData: typeof gatheringsWithGuests.$inferSelect) {
  let message = 'Gathering for '

  const gamebox = gatheringData.gamebox as { title?: string } | null
  message += `*${gamebox?.title || gatheringData.own_name}*`

  if (gatheringData.start_date) {
    const date = new Date(gatheringData.start_date).toLocaleDateString()
    message += ' at ' + date
  }
  message += ':\n'

  message += 'has been *canceled*'
  return message
}
