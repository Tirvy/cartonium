import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  
  const { data, error } = await client.from('gatherings').select('*').eq('club_id', 2);
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})