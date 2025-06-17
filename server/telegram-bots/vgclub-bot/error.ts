import botLuba from './bot-object';

const techSupportChatIds = [327078611];
export default async function sendBotError(message: string, chatId?: number) {

    if (techSupportChatIds) {
        techSupportChatIds.forEach(id => {
            botLuba.sendMessage({
                chat_id: id,
                text: message + '\n by ' + chatId,
                disable_notification: true,
            });
        })
    }
}