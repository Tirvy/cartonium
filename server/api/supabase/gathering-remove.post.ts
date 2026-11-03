import { eq } from 'drizzle-orm'
import { db } from '#server/db'
import { gatherings, gatheringsGuests, gatheringsWithGuests } from '#server/db/schema'
import telegramNotify from '#server/utils/telegram-notify'
import requireUser from '#server/utils/require-user'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)

  const gatheringGuestsRows = await db
    .select()
    .from(gatheringsWithGuests)
    .where(eq(gatheringsWithGuests.id, body.gathering_id))

  await db.delete(gatheringsGuests).where(eq(gatheringsGuests.gathering_id, body.gathering_id))
  await db.delete(gatherings).where(eq(gatherings.id, body.gathering_id))

  gatheringGuestsRows.forEach((item) => {
    if (item.guests_number && item.guests_number >= 1) {
      const message = getMessage(item)
      telegramNotify(event, {
        to: user.user_metadata.telegram_id,
        bot_name: process.env.NUXT_PUBLIC_BOT_LOGIN,
        type: 'gathering-removed',
        why: `because i can`,
        what: message,
      })
    }
  })

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
