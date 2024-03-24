import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~/types/supabase.js'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const query = getQuery(event);
  const clubid = query.clubid as string;
  
  const { data, error } = await client.from('gatherings').select('*').eq('club_id', clubid);

  if (error) {
    throw createError({ statusMessage: error.message })
  }


  return data
})