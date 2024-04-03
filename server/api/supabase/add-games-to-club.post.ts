import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from "~/types/supabase.js";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<Database>(event)
  const body = await readBody(event);
  const query = getQuery(event);
  const clubId = query.clubid as string;
  const gameBoxIds: Array<number> = body.gameBoxIds;

  const dataToSend = gameBoxIds.map(gameBoxId => {
    return {
      game_box_id: gameBoxId,
      club_id: clubId,
    }
  })

  const { data, error } = await client.from('clubs_collections').upsert(dataToSend, {onConflict: 'game_box_id, club_id', ignoreDuplicates: true});
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})