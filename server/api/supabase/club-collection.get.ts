import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase.js'
import type { GameBox } from "~/types/frontend.js";
import { gameBoxFromSupabase } from '~/server/transformers.js';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const clubId = query.clubid as string;

  const client = await serverSupabaseClient<Database>(event)

  const { data, error } = await client.from('gameboxes_with_club_id').select('*').contains('club_id', [clubId]);
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  // const ret_data = data.map(item => {
  //   return gameBoxFromSupabase(item);
  // })

  return data
})