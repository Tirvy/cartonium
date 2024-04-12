import { serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase.js';
import { gatheringFromSupabase } from '~/server/transformers';
import { Gathering } from '~/types/frontend';

export default defineEventHandler(async (event): Promise<Gathering> => {
  const client = await serverSupabaseClient<Database>(event);
  const query = getQuery(event);
  const clubid = query.clubid as string;
  const gatheringid = query.gatheringid as string;

  if (isNaN(+gatheringid)) {
    throw createError({ statusMessage: 'Gathering ID must be a number' });
  }

  const { data, error } = await client.from('gatherings').select('*').eq('club_id', clubid).eq('id', +gatheringid).single();

  if (error) {
    throw createError({ statusMessage: error.message })
  }


  return gatheringFromSupabase(data);
})