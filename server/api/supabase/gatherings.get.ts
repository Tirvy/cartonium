import { serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase.js';
import { gatheringFromSupabase } from '~/server/transformers';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const query = getQuery(event);
  const clubid = query.clubid as string;

  const startDate = new Date();
  startDate.setHours(0,0,0,0);
  
  const { data, error } = await client.from('gatherings').select('*').gte('start_date', startDate.toISOString()).eq('club_id', clubid);

  if (error) {
    throw createError({ statusMessage: error.message })
  }


  return data.map(gatheringFromSupabase);
})