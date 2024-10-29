import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import { gameBoxToSupabase } from '~/server/transformers';
import type { Database } from '~/types/supabase.js'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<Database>(event)
  const gameboxes = await readBody(event);

  const gameboxesFormattedForBd = gameboxes.map(gameBoxToSupabase)

  // onConflict: "alias_tesera" = temp fix [31.08.2024]
  const { data, error } = await client.from('gameboxes').upsert(gameboxesFormattedForBd, { ignoreDuplicates: true, onConflict: "alias_tesera" }).select();
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  gameboxes.forEach(async (gamebox: GameBox)=> {
    const supaPicUrl = await $fetch('/api/supabase/gamebox-picture',
      { method: 'post', body: { gamebox: gamebox } }
    );
  });

  return data;
})