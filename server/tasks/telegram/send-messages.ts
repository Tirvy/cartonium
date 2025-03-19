import telegramBots from '~/server/utils/telegram-bots';
import { serverSupabaseServiceRole } from '#supabase/server';
import { type H3Event } from 'h3';
import { createClient } from '@supabase/supabase-js';
const supabaseClient = createClient<Database, 'pgmq_public'>(process.env.SUPABASE_URL + '', process.env.SUPABASE_SERVICE_KEY + '', {
  db: { schema: 'pgmq_public' }
});

export default defineTask({
  meta: {
    description: "Squash telegram notifications, then send",
  },
  async run({ payload, context }) {
    console.log("Running telegram notifications task...");
    const readResult  = await supabaseClient.rpc('read', {
      n: Infinity,
      queue_name: 'telegram-messages',
      sleep_seconds: 1,
    }) as {data: QueueMesageType[] | null};

    let sent = 0;
    if (readResult.data?.length) {
      readResult.data.forEach(async element => {
        if (true) {
          telegramBots.botPublic?.sendMessage({
            chat_id: element.message.to,
            text: element.message.what
          });

          const archiveResult = await supabaseClient.rpc('archive', {
            message_id: element.msg_id,
            queue_name: 'telegram-messages',
          })
          sent++;
        }
      });
    }
    console.log(`Got ${readResult.data?.length} messaged of which ${sent} were sent`);
    return { result: "Success" };
  },
});

// i dont know why supabase default typing doesent include this. Sad. @tirvy 03.2025
interface QueueMesageType {
  msg_id: number
  read_ct: number
  enqueued_at: string // '2025-03-17T10:44:50.66239+00:00'
  vt: string // '2025-03-17T10:44:50.66239+00:00'
  message: TelegramNotification
}