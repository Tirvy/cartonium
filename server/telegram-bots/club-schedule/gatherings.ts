import { gatheringWithGuestsFromSupabase } from '#server/transformers';
import type { GatheringWithGuests } from '~/types/frontend.js';
import supabase from './supabase';

function clampGatherings(gatheringsArray: GatheringWithGuests[]): GatheringWithGuests[] {
  const hashed = gatheringsArray.reduce((acc: Record<string, GatheringWithGuests>, gathering) => {
    const foundItem = acc[gathering.id];
    if (foundItem) {
      foundItem.guests = [...foundItem.guests, ...gathering.guests];
      foundItem.slotsFilled = foundItem.guests.reduce((sum, item) => sum + item.totalGuests, 0);
    } else {
      acc[gathering.id] = { ...gathering };
    }
    return acc;
  }, {});

  return Object.values(hashed);
}

export async function fetchUpcomingGatherings(clubId: string): Promise<GatheringWithGuests[]> {
  if (!supabase) {
    throw new Error('Supabase client is not configured (SUPABASE_URL / SUPABASE_SERVICE_KEY)');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('gatherings_with_guests')
    .select('*')
    .gte('start_date', today.toISOString())
    .eq('club_id', clubId)
    .order('start_date', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return clampGatherings((data || []).map(gatheringWithGuestsFromSupabase));
}

export async function findProfileIdByTelegramChatId(telegramId: number): Promise<string | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('chat_id', telegramId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data.id;
}

function formatDateHeader(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function formatGatheringsMessage(
  clubTitle: string,
  gatherings: GatheringWithGuests[],
  profileId: string | null,
): string {
  if (!gatherings.length) {
    return `Сборы клуба «${clubTitle}»\n\nНет предстоящих сборов.`;
  }

  const lines: string[] = [`Сборы клуба «${clubTitle}»`, ''];
  let lastDay = '';

  for (const gathering of gatherings) {
    const start = new Date(gathering.startDate);
    const key = dayKey(start);
    if (key !== lastDay) {
      if (lastDay) {
        lines.push('');
      }
      lines.push(formatDateHeader(start));
      lastDay = key;
    }

    const title = gathering.gamebox?.title || gathering.ownTitle || gathering.ownName || 'Сбор';
    const slots = `${gathering.slotsFilled}/${gathering.guestsMax}`;
    const mine =
      profileId && gathering.guests.some((g) => g.id === profileId && g.totalGuests > 0)
        ? ' ✓'
        : '';
    lines.push(`${formatTime(start)} — ${title} (${slots})${mine}`);
  }

  const text = lines.join('\n');
  const limit = 4000;
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit)}\n…`;
}
