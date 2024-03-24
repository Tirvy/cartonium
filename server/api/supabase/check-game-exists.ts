import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase.js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const title = (query.title as string).trim();
  if (!title) {
    throw createError({ statusMessage: 'title required' })
  }
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<Database>(event)

  const { data, error } = await client.from('gameboxes').select('*').contains('titles', [title]);
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})