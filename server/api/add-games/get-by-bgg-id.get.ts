// query: {bggid}
// checks bd for this bggid, returns this gamebox if exists
// if no gamebox with this bggid - fetches bgg and returns its data

import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import { gameBoxFromSupabase } from '~/server/transformers';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const bggId = query.bggid as string;
  if (!bggId || !+bggId) {
    throw createError({ statusMessage: 'bggid required' })
  }
  const client = await serverSupabaseClient<Database>(event);
  const { data, error } = await client.from('gameboxes').select('*').eq('bggid', bggId).single();
  if (error) {
    throw createError({ message: error.message })
  }
  if (data) {
    console.log(data);
    return gameBoxFromSupabase(data);
  }

  const bggGameboxResponse = await $fetch('/api/bgg/get-gamebox', { query: { id: bggId } });

  if (bggGameboxResponse) {
    return bggGameboxResponse;
  }
  throw createError({ message: 'Well that unexpected' });
})