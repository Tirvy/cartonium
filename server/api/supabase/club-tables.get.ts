import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase.js';
import { tablesFromSupabase } from '~/server/transformers';

export default defineEventHandler(async (event): Promise<Table[]> => {
  const query = getQuery(event);
  const clubId = query.clubid as string;

  if (!clubId) {
    throw createError({ statusMessage: 'Missing clubid' })
  }

  const client = await serverSupabaseClient<Database>(event)

  const { data, error } = await client.from('tables').select('*').eq('club_id', clubId);
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data.map(tablesFromSupabase);
})