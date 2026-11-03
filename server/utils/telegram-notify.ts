import type { H3Event, EventHandlerRequest } from 'h3'
import type { TelegramNotification } from '~/types/frontend.js'
import sendTelegramMessage from './send-telegram-message'

export default async function telegramNotify(
  _event: H3Event<EventHandlerRequest>,
  message: TelegramNotification,
) {
  if (!message.to || !Number.isFinite(Number(message.to))) {
    console.warn('telegramNotify skipped: invalid chat id', message.type)
    return
  }
  const result = sendTelegramMessage({
    ...message,
    to: Number(message.to),
  })
  console.log(result)
}
