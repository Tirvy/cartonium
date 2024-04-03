import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import { gameBoxFromSupabase } from '~/server/transformers';

export default defineEventHandler(async (event): Promise<number[]> => {
  const query = getQuery(event);
  const ids = (query.ids as string[]);
  const clubId = (query.clubid as string);
  if (!ids?.length || !clubId) {
    throw createError({ statusMessage: 'ids & clubId required' })
  }
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<Database>(event)

  const { data, error } = await client.from('clubs_collections').select('*').eq('club_id', clubId).in('game_box_id', ids);
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data.map(item => item.game_box_id);
})