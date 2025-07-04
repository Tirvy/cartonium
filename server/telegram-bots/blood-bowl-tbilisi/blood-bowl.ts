import botBloodBowl from './blood-bowl-predicter';
export default botBloodBowl;

import dataStorage from './storage';

import { getCurrentFixtures, getLeagueLink, getCurrentWeekNumber, getAllFixtures } from './api-tourplay';
import { fetchChatsToStore, saveFixtures, saveVoteToGoogle } from './api-google-sheets';
import type { TeamPosition } from './types'

import { sendVotesTo, sendVotesToEveryone, updateMessageButtons } from './votes-and-buttons';
import { getTelegramChatsFromStore, getVotes, setVotesToStore } from './common';
import { handleNewChat } from './handle-new-chat';
import sendBloodBowlError from './error';


if (botBloodBowl) {
    botBloodBowl.startPolling();

    botBloodBowl.on("callback_query", async query => {
        const chat = query.from;
        const data = query.data;
        const splitData = data?.split('|');
        if (!splitData?.length) {
            botBloodBowl.answerCallbackQuery({
                callback_query_id: query.id,
                text: 'Ошибка бота (бага)',
                show_alert: true,
            });
            sendBloodBowlError(chat.id, `Ошибка: неформатный запрос голоса: ${query.data}`);
            return;
        }
        const matchId = +splitData[0];
        let choise = splitData[1] as TeamPosition | undefined;

        let votesData = await getVotes();

        if (!votesData[chat.id]) {
            votesData[chat.id] = {};
        }
        if (votesData[chat.id][matchId] === choise) {
            choise = undefined;
        }
        const dataToSave = {
            chatId: chat.id,
            matchId: +matchId,
            choise: choise,
            date: Date.now(),
        };
        const googleSuccess = await saveVoteToGoogle(dataToSave)
        if (!googleSuccess) {
            botBloodBowl.answerCallbackQuery({
                callback_query_id: query.id,
                text: 'Ошибка гугла (бага)',
                show_alert: true,
            });
            sendBloodBowlError(chat.id, JSON.stringify(dataToSave));
            return;
        }

        botBloodBowl.answerCallbackQuery({
            callback_query_id: query.id,
            text: 'Голос принят'
        });

        votesData[chat.id][matchId] = choise;
        await setVotesToStore(votesData);
        await updateMessageButtons(query, matchId);
    });


    botBloodBowl.on('message', async (message) => {

        let telegramChats = await getTelegramChatsFromStore();
        if (!telegramChats?.length) {
            await fetchChatsToStore();
            telegramChats = await getTelegramChatsFromStore();
            if (!telegramChats?.length) {
                return;
            }
        }

        const chatInfo = telegramChats.find(item => item.chatId === message.chat.id);
        if (!chatInfo?.meta || !chatInfo?.tourplayName) {
            handleNewChat(message);
            return;
        }

        if (message.text === '/get_link') {
            botBloodBowl.sendMessage({
                chat_id: message.chat.id,
                text: getLeagueLink(),
                reply_parameters: {
                    message_id: message.message_id
                }
            });
            return;
        }

        const commandGimmeVotes = '/gimme_votes_again';
        if (message.text?.startsWith(commandGimmeVotes)) {
            const textWeekNumber = message.text.slice(commandGimmeVotes.length);
            let weekNumber = +(textWeekNumber.trim()) - 1;
            const maxWeekNumber = (await getAllFixtures()).length;
            if (!weekNumber || weekNumber < 0 || weekNumber > maxWeekNumber - 1) {
                weekNumber = await getCurrentWeekNumber();
            }
            sendVotesTo(chatInfo.chatId, weekNumber);
            return;
        }

        if (message.text === '/update_fixtures') {
            if (!chatInfo.isAdmin) {
                botBloodBowl.sendMessage({
                    chat_id: message.chat.id,
                    text: 'азаза тебе, написано же - только для админов!',
                });
                return;
            }
            const competition = await getCurrentFixtures();
            saveFixtures(competition);
            dataStorage.setItem('fixtures', competition);
            return;
        }

        if (message.text === '/start_votes') {
            if (!chatInfo.isAdmin) {
                botBloodBowl.sendMessage({
                    chat_id: message.chat.id,
                    text: 'азаза тебе, написано же - только для админов!',
                });
                return;
            }
            sendVotesToEveryone();
            return;
        }
    });

}