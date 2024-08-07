import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import { gameBoxToSupabase } from '~/server/transformers';
import type { Database } from '~/types/supabase.js'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<Database>(event)
  const gameboxes = await readBody(event);

  const gameboxesFormattedForBd = gameboxes.map(gameBoxToSupabase)

  const { data, error } = await client.from('gameboxes').insert(gameboxesFormattedForBd).select();
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})