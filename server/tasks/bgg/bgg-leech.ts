import telegramBots from '~/server/utils/telegram-bots';
import { serverSupabaseServiceRole } from '#supabase/server';
import { type H3Event } from 'h3';
import { createClient } from '@supabase/supabase-js';
const supabaseClient = createClient<Database, 'public'>(process.env.SUPABASE_URL + '', process.env.SUPABASE_SERVICE_KEY + '', {
  db: { schema: 'public' }
});

const dataStorage = useStorage('bgg-leach');

export default defineTask({
  meta: {
    description: "Get top BGG games to our bd",
  },
  async run({ payload, context }) {

    const leechQueue = await dataStorage.getItem<number[]>('queue');
    if (!leechQueue?.length) {
      updateQueue();
      return { result: "Wait" };
    }

    const currentItemId = leechQueue[0];
    const hasInSupabase = await supabaseClient.from('gameboxes').select().eq('id_bgg', currentItemId).single();
    if (hasInSupabase) {
      // delete item
      console.warn(`There is already a gamebox with id_bgg: ${currentItemId}`)
      return { result: "Wait" };
    }

    const bggResponse = await $fetch('/api/bgg/get-gamebox', { query: { id: currentItemId } });

    if (!bggResponse) {
      console.warn(`No gamebox found for id: ${currentItemId}`);
    }

    const supabaseResponse = await $fetch('/api/supabase/gamebox-add', { method: 'post', body: bggResponse });
    console.log(supabaseResponse);
    
    return { result: "Success" };
  },
});

async function updateQueue() {

}