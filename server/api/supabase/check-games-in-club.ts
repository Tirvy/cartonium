import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase.js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const ids = (query.ids as string[]);
  const clubId = (query.clubId as string);
  if (!ids?.length || !clubId) {
    throw createError({ statusMessage: 'title required' })
  }
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<Database>(event)

  const { data, error } = await client.from('clubs_collection').select('*').eq('club_id', clubId).in('gamebox_id', ids);
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})