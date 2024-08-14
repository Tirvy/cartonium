import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase.js'
import type { GameBox, GameBoxWithClub } from "~/types/frontend.js";
import { gameBoxFromSupabase } from '~/server/transformers.js';

// todo: fix next line!
/// its a copypasta from club-collection
export default defineEventHandler(async (event): Promise<{ items: GameBoxWithClub[] }> => {
  const query = getQuery(event) as { page: number, itemsPerPage: number, sortBy: { key: string, order: string }, search: string };

  const client = await serverSupabaseClient<Database>(event)

  const pageSize = +query.itemsPerPage || 25;
  let request = client.from('gameboxes_with_club_id').select('*');
  if (query.search) {
    request = request.textSearch("title", query.search, {
      type: 'websearch',
    })
  }
  if (query.page) {
    const page = query.page - 1;
    request = request.range(page * pageSize, (page + 1) * pageSize);
  }
  if (query.sortBy) {
    request = request.order(query.sortBy.key, { ascending: query.sortBy.order === 'ascending' })
  }

  const { data, error } = await request;
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  // const ret_data = data.map(item => {
  //   return gameBoxFromSupabase(item);
  // })

  return {
    items: data.map(gameBoxFromSupabase)
  };
})