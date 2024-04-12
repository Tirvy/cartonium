import { serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase.js';
import { gatheringFromSupabase } from '~/server/transformers';

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


  const { data, error } = await client.from('gatherings').select('*').gte('start_date', startDate).eq('club_id', clubid)
    .order('start_date', { ascending: true });

  if (error) {
    throw createError({ statusMessage: error.message })
  }


  return data.map(gatheringFromSupabase);
})