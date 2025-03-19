import telegramBots from '~/server/utils/telegram-bots';

export default function sendTelegramMessage(message: TelegramNotification) {
    telegramBots.botPublic?.sendMessage({
        chat_id: message.to,
        text: message.what,
        parse_mode: 'MarkdownV2'
    });
}