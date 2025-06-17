import { TelegramBot } from 'typescript-telegram-bot-api';

const botFloodReaderToken = process.env.NUXT_BOT_FLOODREADER_TOKEN || '';
let botFloodReader = undefined;
if (botFloodReaderToken) {
  botFloodReader = new TelegramBot({ botToken: botFloodReaderToken });
  (async () => {
    console.log('\nfloodreader bot initiated\n', await botFloodReader.getMe())
  })()
}

export default botFloodReader as TelegramBot