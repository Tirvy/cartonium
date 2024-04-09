import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import { gameBoxFromSupabase } from '~/server/transformers';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const body = await readBody(event);
  const titles = (body.titles as string[]);
  if (!titles?.length) {
    throw createError({ statusMessage: 'title required' })
  }
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<Database>(event)

  const { data, error } = await client.from('gameboxes').select('*').overlaps('titles', titles);
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data;
  // return data.map(gameBoxFromSupabase);
})