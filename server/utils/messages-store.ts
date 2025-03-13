import { serverSupabaseServiceRole } from '#supabase/server';
import type { H3Event, EventHandlerRequest } from 'h3';
import type { TelegramNotification } from "~/types/frontend.js";

export default async function sendTelegramMessage(event: H3Event<EventHandlerRequest>, message: TelegramNotification) {
  const client = serverSupabaseServiceRole(event);

  const result = await client.schema('pgmq_public').rpc('send', {
    queue_name: 'telegram-messages',
    message: message,
    sleep_seconds: 0,
  })
  console.log(result)
}