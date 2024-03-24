import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import { Database } from '~/types/supabase.js'
import { GameBox } from "~/types/gameBox.js";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const clubId = query.clubid as string;

  const client = await serverSupabaseClient<Database>(event)
  
  const { data, error } = await client.from('clubs_info').select('*').eq('club_id', clubId).single();
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})