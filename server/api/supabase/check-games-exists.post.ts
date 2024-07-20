import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import { gameBoxFromSupabase } from '~/server/transformers';
import { formatDiagnosticsWithColorAndContext } from 'typescript';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const body = await readBody(event);
  const titles = (body.titles as string[]);
  if (!titles?.length) {
    throw createError({ statusMessage: 'title required' })
  }
  const client = await serverSupabaseClient<Database>(event);

  let retData: unknown[] = [];

  const splitLimit = 80;
  let titlesLeft = [...titles];
  while (titlesLeft.length > splitLimit) {
    const titlesNow = titlesLeft.slice(0, splitLimit);
    const { data, error } = await client.from('gameboxes').select('*').overlaps('titles', titlesNow);
    if (error) {
      throw createError({ message: error.message })
    }
    retData = retData.concat(data);
    titlesLeft = titlesLeft.slice(splitLimit);
  }


  return retData.map(gameBoxFromSupabase);
})