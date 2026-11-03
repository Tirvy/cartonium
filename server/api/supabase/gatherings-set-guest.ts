import { and, eq } from 'drizzle-orm'
import { db } from '#server/db'
import { gatheringsGuests, gatheringsWithGuests } from '#server/db/schema'
import telegramNotify from '#server/utils/telegram-notify'
import requireUser from '#server/utils/require-user'
import type { User } from '@supabase/auth-js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)

  const previousData = await db
    .select()
    .from(gatheringsWithGuests)
    .where(
      and(
        eq(gatheringsWithGuests.id, body.gathering_id),
        eq(gatheringsWithGuests.user_id, body.guest_id),
      ),
    )

  const [data] = await db
    .insert(gatheringsGuests)
    .values({
      gathering_id: body.gathering_id,
      user_id: body.guest_id,
      guests_number: body.number,
    })
    .onConflictDoUpdate({
      target: [gatheringsGuests.gathering_id, gatheringsGuests.user_id],
      set: { guests_number: body.number },
    })
    .returning()

  if (!data) {
    throw createError({ statusMessage: 'Failed to update guest' })
  }

  if (previousData.length) {
    const message = creatMessage(user, data, previousData)

    telegramNotify(event, {
      to: user.user_metadata.telegram_id,
      bot_name: process.env.NUXT_PUBLIC_BOT_LOGIN,
      type: 'gathering-player-change',
      why: `because i can`,
      what: message,
    })
  }

  return { status: 'ok' }
})

function creatMessage(
  user: User,
  newData: typeof gatheringsGuests.$inferSelect,
  previousData: (typeof gatheringsWithGuests.$inferSelect)[],
) {
  let message = 'Gathering for '

  const userPrevData = previousData.find((item) => item.user_id === user.id)
  const userPrevGuests = userPrevData?.guests_number
  const userNewGuests = newData.guests_number
  const gatheringData = previousData[0]

  const gamebox = gatheringData.gamebox as { title?: string } | null
  message += `*${gamebox?.title || gatheringData.own_name}*`

  if (gatheringData.start_date) {
    const date = new Date(gatheringData.start_date).toLocaleDateString()
    message += ' at ' + date
  }
  message += ':\n'

  let username = user.user_metadata.full_name
  if (user.user_metadata.telegram_username) {
    username += ` @${user.user_metadata.telegram_username}`
  }
  if (!userPrevData || userPrevGuests === 0) {
    message += `${username} joined`
    if (userNewGuests > 1) {
      message += ` with ${userNewGuests - 1} guests`
    }
  } else if (newData?.guests_number === 0) {
    message += `${username} left`
  } else if (userPrevGuests) {
    message += `${username} has changed number of their guests from ${userPrevGuests - 1} to ${userNewGuests - 1}`
  }
  return message
}
