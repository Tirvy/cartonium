
import type { Message } from 'typescript-telegram-bot-api/dist/types';
import botBloodBowl from './blood-bowl-predicter';
import { getTelegramChatsFromStore, addNewChatData } from './common';
import { sendVotesTo } from './votes-and-buttons';


export async function handleNewChat(message: Message) {

    const telegramChats = await getTelegramChatsFromStore();
    if (!telegramChats?.length) {
        return;
    }
    const chatInfo = telegramChats.find(item => item.chatId === message.chat.id);
    if (!chatInfo?.meta) {
        botBloodBowl.sendMessage({
            chat_id: message.chat.id,
            text: 'Введите своё тренерское имя'
        });
        addNewChatData({
            chatId: message.chat.id,
            tourplayName: "",
            meta: JSON.stringify(message.chat),
            isAdmin: false,
        });
        return;
    } else if (!chatInfo.tourplayName) {
        const nameToCheck = message.text;
        if (telegramChats.some(item => item.tourplayName === nameToCheck)) {
            botBloodBowl.sendMessage({
                chat_id: message.chat.id,
                text: 'Вы приняты, проходите'
            });
            botBloodBowl.setMessageReaction({
                chat_id: message.chat.id,
                message_id: message.message_id,
                reaction: [{
                    type: 'emoji', emoji: '❤️'
                }]
            });
            sendVotesTo(chatInfo.chatId);
            addNewChatData({
                chatId: message.chat.id,
                tourplayName: nameToCheck || "wableyuTeaEf",
                meta: JSON.stringify(message.chat),
                isAdmin: false,
            });
        } else {
            await botBloodBowl.sendMessage({
                chat_id: message.chat.id,
                text: 'Такого имени в лиге не найдено. Введи своё имя тренера, чтобы бот мог что-либо делать полезное',
                reply_parameters: {
                    message_id: message.message_id,
                }
            });
            botBloodBowl.sendPhoto({
                chat_id: message.chat.id,
                photo: 'AgACAgIAAxkBAAOuaCy_3jHALfgJKUJZYhguBhlo0KQAAuH2MRtWgWhJKQKpUR8ytnoBAAMCAANzAAM2BA',
                caption: 'Например, имя этого тренера - DefinitelyNotWhale. А теперь найди своё имя и введи его сюда так же! Или напиши Эрни в личку.'
            })

            return;
        }
    }
}