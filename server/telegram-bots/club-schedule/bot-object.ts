import { TelegramBot } from 'typescript-telegram-bot-api';

const botClubScheduleToken = process.env.NUXT_BOT_SCHEDULE_TOKEN || '';
let botClubSchedule = undefined as TelegramBot | undefined;
if (botClubScheduleToken) {
  botClubSchedule = new TelegramBot({ botToken: botClubScheduleToken });
  (async () => {
    console.log('\nclub-schedule bot initiated\n', await botClubSchedule!.getMe())
  })()
}

export default botClubSchedule as TelegramBot
