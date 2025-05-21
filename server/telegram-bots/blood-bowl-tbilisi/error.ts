import botBloodBowl from './blood-bowl-predicter';

const techSupportChatId = process.env.NUXT_BOT_BLOODBOWL_SUPPORT_ID || '';
export default async function sendBloodBowlError(chatId: number, message: string) {

    botBloodBowl.sendMessage({
        chat_id: chatId,
        text: message,
    });

    if (techSupportChatId) {
        botBloodBowl.sendMessage({
            chat_id: chatId,
            text: message + '\n by ' + chatId,
            disable_notification: true,
        });
    }
}