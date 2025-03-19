import type { H3Event, EventHandlerRequest } from 'h3';
import type { TelegramNotification } from "~/types/frontend.js";
// import storeMessage from './store-message';
import sendTelegramMessage from "./send-telegram-message";

export default async function telegramNotify(event: H3Event<EventHandlerRequest>, message: TelegramNotification) {
  // storeMessage(event, message);
  const result = sendTelegramMessage(message);
  console.log(result);
}