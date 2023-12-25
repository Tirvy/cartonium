import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import { GameBox } from "~/types/gameBox.js";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { clubId } = useRuntimeConfig(event);

  const client = await serverSupabaseClient(event)
  clubId
  const { data, error } = await client.from('gameboxes_with_club_id').select('*').contains('club_id', [2]);
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  const ret_data = data.map( item => {
    return new GameBox(item);
  })

  return ret_data
})