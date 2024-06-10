import { serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase.js'

import { clubFromSupabase } from '@/server/transformers';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const query = getQuery(event);

  const clubname = query.clubname as string;


  const clubData = await client.from('clubs').select('*').eq('url_name', clubname).single();
  if (clubData.error) {
    throw createError({ statusMessage: clubData.error.message })
  }
  const clubSettings = await client.from('clubs_settings').select('*').eq('club_id', clubData.data.id).single();
  if (clubSettings.error) {
    if (clubSettings.error.message !== 'JSON object requested, multiple (or no) rows returned') {
      throw createError({ statusMessage: clubSettings.error.message })
    } 
  }

  return clubFromSupabase(clubData.data, clubSettings.data || baseSettings);
})

const baseSettings = {
  themes: {},
  avatar_url: '',
  guest_can_gather_own: false,
  guest_can_reserve: false,
}
