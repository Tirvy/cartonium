import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase.js'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<Database>(event)
  const gameboxes = await readBody(event);

  const { data, error } = await client.from('gameboxes').insert(gameboxes).select();
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})