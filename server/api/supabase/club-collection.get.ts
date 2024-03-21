import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import { GameBox } from "~/types/gameBox.js";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const clubId = query.clubid as string;

  const client = await serverSupabaseClient(event)
  
  const { data, error } = await client.from('gameboxes_with_club_id').select('*').contains('club_id', [clubId]);
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  const ret_data = data.map( item => {
    return new GameBox(item);
  })

  return ret_data
})