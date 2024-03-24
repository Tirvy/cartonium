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

  const { data, error } = await client.from('clubs_collections').insert(dataToSend);
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})