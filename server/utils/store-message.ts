import type { H3Event, EventHandlerRequest } from 'h3'
import type { TelegramNotification } from '~/types/frontend.js'

/**
 * Formerly queued messages via Supabase pgmq.
 * Queue worker is disabled; prefer direct telegramNotify / sendTelegramMessage.
 */
export default async function storeMessage(
  _event: H3Event<EventHandlerRequest>,
  message: TelegramNotification,
) {
  console.warn('storeMessage is a no-op (pgmq removed with Supabase). Message:', message.type)
}
