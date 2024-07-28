import { serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase.js';
import { gatheringWithGuestsFromSupabase } from '~/server/transformers';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const query = getQuery(event);
  const clubid = query.clubid as string;

  let startDate = '';
  if (query['date-from']) {
    startDate = query['date-from'] as string;
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate = today.toISOString();
  }

  const { data, error } = await client.from('gatherings_with_guests').select('*').gte('start_date', startDate).eq('club_id', clubid)
    .order('start_date', { ascending: true });

  if (error) {
    throw createError({ statusMessage: error.message })
  }


  return clampGatherings(data.map(gatheringWithGuestsFromSupabase));
})

function clampGatherings(gatheringsArray: GatheringWithGuests[]) {
  let hashed = gatheringsArray.reduce((acc: any, gathering) => {
    const foundItem: GatheringWithGuests = acc[gathering.id];
    if (foundItem) {
      foundItem.guests = [...foundItem.guests, ...gathering.guests];
      foundItem.slotsFilled = foundItem.guests.reduce((acc: number, item) => {
        return acc + item.totalGuests
      }, 0);
    } else {
      acc[gathering.id] = {
        ...gathering,
      }
    }
    return acc;
  }, {})

  return Object.values(hashed);
} 