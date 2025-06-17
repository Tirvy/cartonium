import { TelegramBot } from 'typescript-telegram-bot-api';

const botBloodBowlToken = process.env.NUXT_BOT_BLOODBOWL_TOKEN || '';
let botBloodBowl = undefined;
if (botBloodBowlToken) {
  botBloodBowl = new TelegramBot({ botToken: botBloodBowlToken });
  (async () => {
    console.log('\nbloodbowl bot initiated\n', await botBloodBowl.getMe())
  })()
}

export default botBloodBowl as TelegramBot