import { and, asc, eq, gte } from 'drizzle-orm'
import { gatheringWithGuestsFromDb } from '#server/transformers'
import { db } from '#server/db'
import { gatheringsWithGuests, profiles } from '#server/db/schema'
import type { GatheringWithGuests } from '~/types/frontend.js'

function clampGatherings(gatheringsArray: GatheringWithGuests[]): GatheringWithGuests[] {
  const hashed = gatheringsArray.reduce((acc: Record<string, GatheringWithGuests>, gathering) => {
    const foundItem = acc[gathering.id]
    if (foundItem) {
      foundItem.guests = [...foundItem.guests, ...gathering.guests]
      foundItem.slotsFilled = foundItem.guests.reduce((sum, item) => sum + item.totalGuests, 0)
    } else {
      acc[gathering.id] = { ...gathering }
    }
    return acc
  }, {})

  return Object.values(hashed)
}

export async function fetchUpcomingGatherings(clubId: string): Promise<GatheringWithGuests[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const data = await db
    .select()
    .from(gatheringsWithGuests)
    .where(
      and(gte(gatheringsWithGuests.start_date, today), eq(gatheringsWithGuests.club_id, clubId)),
    )
    .orderBy(asc(gatheringsWithGuests.start_date))

  return clampGatherings(data.map(gatheringWithGuestsFromDb))
}

export async function findProfileIdByTelegramChatId(telegramId: number): Promise<string | null> {
  const [data] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.chat_id, telegramId))
    .limit(1)

  return data?.id ?? null
}

function formatDateHeader(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export function formatGatheringsMessage(
  clubTitle: string,
  gatherings: GatheringWithGuests[],
  profileId: string | null,
): string {
  if (!gatherings.length) {
    return `Сборы клуба «${clubTitle}»\n\nНет предстоящих сборов.`
  }

  const lines: string[] = [`Сборы клуба «${clubTitle}»`, '']
  let lastDay = ''

  for (const gathering of gatherings) {
    const start = new Date(gathering.startDate)
    const key = dayKey(start)
    if (key !== lastDay) {
      if (lastDay) {
        lines.push('')
      }
      lines.push(formatDateHeader(start))
      lastDay = key
    }

    const title = gathering.gamebox?.title || gathering.ownTitle || gathering.ownName || 'Сбор'
    const slots = `${gathering.slotsFilled}/${gathering.guestsMax}`
    const mine =
      profileId && gathering.guests.some((g) => g.id === profileId && g.totalGuests > 0) ? ' ✓' : ''
    lines.push(`${formatTime(start)} — ${title} (${slots})${mine}`)
  }

  const text = lines.join('\n')
  const limit = 4000
  if (text.length <= limit) {
    return text
  }
  return `${text.slice(0, limit)}\n…`
}
