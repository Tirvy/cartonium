import { TelegramBot } from 'typescript-telegram-bot-api';

const botPublicToken = process.env.NUXT_BOT_TOKEN || '';
let botPublic = undefined;
if (botPublicToken) {
    botPublic = new TelegramBot({ botToken: botPublicToken });
    (async () => {
        console.log('\npublic bot initiated\n', await botPublic.getMe())
    })()
}

const botLoggerToken = process.env.NUXT_BOT_LOGER_TOKEN || '';
let botLogger = undefined;
if (botLoggerToken) {
    botLogger = new TelegramBot({ botToken: botLoggerToken });
    (async () => {
        console.log('\nlogger bot initiated\n', await botLogger.getMe())
    })()
}

export default {
    botPublic,
    botLogger
};