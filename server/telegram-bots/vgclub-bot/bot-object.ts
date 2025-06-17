import { TelegramBot } from 'typescript-telegram-bot-api';

const botVgclubToken = process.env.NUXT_BOT_VGCLUB_TOKEN || '';
let botVgclub = undefined;
if (botVgclubToken) {
  botVgclub = new TelegramBot({ botToken: botVgclubToken });
  (async () => {
    console.log('\nLuba bot initiated\n', await botVgclub.getMe())
  })()
}

export default botVgclub as TelegramBot