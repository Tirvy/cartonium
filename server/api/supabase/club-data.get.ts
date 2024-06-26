import { serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase.js'

import { clubFromSupabase } from '@/server/transformers';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const query = getQuery(event);

  const clubname = query.clubname as string;


  const { data, error } = await client.from('clubs').select('*').eq('url_name', clubname).single();
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return clubFromSupabase(data);
})
