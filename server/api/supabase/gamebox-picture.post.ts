import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import { blobToFile } from '@/utils/helpers';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);
  const body = await readBody(event);
  const gamebox = body.gamebox;

  const resp: any = await $fetch(gamebox.photoUrl);
  const image = blobToFile(resp, gamebox.id);

  const { data, error } = await client.storage.from('gamebox-pics').upload(
    gamebox.id.toString(), 
    image, 
    { upsert: true },
  );

  if (error) {
    throw createError({ statusMessage: error.message })
  } 
  
  return data;
});
