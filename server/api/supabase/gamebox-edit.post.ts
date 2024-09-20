import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import { gameBoxToSupabase } from '~/server/transformers';
import type { Database } from '~/types/supabase.js'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<Database>(event)
  const gamebox = await readBody(event);

  const gameboxesFormattedForBd = gameBoxToSupabase(gamebox)

  // onConflict: "alias_tesera" = temp fix [31.08.2024]
  const { data, error } = await client.from('gameboxes').update(gameboxesFormattedForBd).eq('id', gamebox.id).select();
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})