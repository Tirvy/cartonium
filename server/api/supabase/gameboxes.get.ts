import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase.js'
import type { GameBox, GameBoxWithClub } from "~/types/frontend.js";
import { gameBoxFromSupabase } from '~/server/transformers.js';

// todo: fix next line!
/// its a copypasta from club-collection
export default defineEventHandler(async (event): Promise<GameBoxWithClub[]> => {
  const query = getQuery(event);

  const client = await serverSupabaseClient<Database>(event)

  const { data, error } = await client.from('gameboxes_with_club_id').select('*');
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  // const ret_data = data.map(item => {
  //   return gameBoxFromSupabase(item);
  // })

  return data.map(gameBoxFromSupabase);
})