import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const query = getQuery(event);

  const clubname = query.clubname as string;


  const { data, error } = await client.from('clubs').select('*').eq('url_name', clubname).single();
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data;
})
