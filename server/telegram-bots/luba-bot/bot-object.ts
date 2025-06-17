import { TelegramBot } from 'typescript-telegram-bot-api';

const botLubaToken = process.env.NUXT_BOT_LUBA_TOKEN || '';
let botLuba = undefined;
if (botLubaToken) {
  botLuba = new TelegramBot({ botToken: botLubaToken });
  (async () => {
    console.log('\nLuba bot initiated\n', await botLuba.getMe())
  })()
}

export default botLuba as TelegramBot