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
  const client = await serverSupabaseClient<Database>(event);

  console.log(titles.length, 1);

  const { data, error } = await client.from('gameboxes').select('*').overlaps('titles', titles);
  console.log(error, 3);
  if (error) {
    throw createError({ message: error.message })
  }

  console.log(data.length, 2);
  return data.map(gameBoxFromSupabase);
  // return data.map(gameBoxFromSupabase);
})