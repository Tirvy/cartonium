import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import { gameBoxFromSupabase } from '~/server/transformers';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const body = await readBody(event);
  let titles = (body.titles as string[]);
  if (!titles?.length) {
    throw createError({ statusMessage: 'title required' })
  }
  titles = titles.map(title => title.trim());
  const client = await serverSupabaseClient<Database>(event);

  let retData: any[] = [];

  const splitLimit = 80;
  let titlesLeft = [...titles];
  while (titlesLeft.length > 0) {
    const toSlice = titlesLeft.length > splitLimit ? splitLimit : titlesLeft.length;
    const titlesNow = titlesLeft.slice(0, toSlice);
    const { data, error } = await client.from('gameboxes').select('*').overlaps('titles', titlesNow);
    if (error) {
      throw createError({ message: error.message })
    }
    retData = retData.concat(data);
    titlesLeft = titlesLeft.slice(toSlice);
  }

  
  return retData.map((item: Tables<'gameboxes'>) => gameBoxFromSupabase(item));
})