import { serverSupabaseUser, serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import { gatheringFromSupabase } from '~/server/transformers'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({ statusMessage: 'User not found' })
  }
  const body = await readBody(event);

  const { data, error } = await client.from('gatherings_guests').upsert(
    {
      gathering_id: body.gathering_id,
      user_id: body.guest_id,
      guests_number: body.number,
    }, { onConflict: 'gathering_id, user_id' }).select().single();
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return { status: 'ok' };
})
