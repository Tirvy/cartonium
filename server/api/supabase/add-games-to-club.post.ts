import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient(event)
  const body = await readBody(event);
  const gameBoxIds: Array<number> = body.gameBoxIds;

  const dataToSend = gameBoxIds.map(gameBoxId => {
    return {
      game_box_id: gameBoxId,
      club_id: 2,
    }
  })

  const { data, error } = await client.from('clubs_collections').insert(dataToSend);
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})