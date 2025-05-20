import botBloodBowl from './blood-bowl-predicter';
export default botBloodBowl;

import dataStorage from './storage';

import { getCurrentFixtures, getLeagueLink } from './api-tourplay';
import { updateTelegramChatsStore, uploadNewTelegramChat, saveFixtures, saveVoteToGoogle, getGoogleVotes } from './api-google-sheets';
import type { competition, teamInfo, telegramChatData, match, teamPosition, BloodBowlVote, HashedVotes } from './types'
import type { Message, CallbackQuery } from 'typescript-telegram-bot-api/dist/types';


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
            return;
        }
        const matchId = +splitData[0];
        let choise = splitData[1] as teamPosition | undefined;

        let votesData = await dataStorage.getItem('votes') as { data: HashedVotes };
        if (!votesData?.data) {
            votesData = {
                data: {}
            };
        }
        if (!votesData.data[chat.id]) {
            votesData.data[chat.id] = {};
        }
        if (votesData.data[chat.id][matchId] === choise) {
            choise = undefined;
        }
        const googleSuccess = await saveVoteToGoogle({
            chatId: chat.id,
            matchId: +matchId,
            choise: choise,
            date: Date.now(),
        })
        if (!googleSuccess) {
            botBloodBowl.answerCallbackQuery({
                callback_query_id: query.id,
                text: 'Ошибка гугла (бага)',
                show_alert: true,
            });
            return;
        }

        botBloodBowl.answerCallbackQuery({
            callback_query_id: query.id,
            text: 'Голос принят'
        });
        
        votesData.data[chat.id][matchId] = choise;
        await dataStorage.setItem('votes', votesData);

        let creds = getCredsFromCallbackQuery(query);
        if (!creds) {
            return;
        }
        const keyboard = await getInlineKeyboard(chat.id);
        botBloodBowl.editMessageReplyMarkup({
            ...creds,
            reply_markup: {
                inline_keyboard: keyboard
            },
        });
    });

    function getCredsFromCallbackQuery(query: CallbackQuery) {
        const originalMessage = query.message;
        let creds;
        if (query.inline_message_id) {
            creds = {
                inline_message_id: query.inline_message_id
            }
        } else if (originalMessage) {
            creds = {
                message_id: originalMessage.message_id,
                chat_id: originalMessage.chat.id,
            }
        } else {
            return null;
        }
        return creds;
    }

    botBloodBowl.on('message', async (message) => {

        let telegramChats = await getTelegramChats();
        if (!telegramChats?.length) {
            await updateTelegramChatsStore();
            telegramChats = await getTelegramChats();
            if (!telegramChats?.length) {
                return;
            }
        }

        if (message.photo) {
            console.log(JSON.stringify(message.photo));
        }

        const chatInfo = telegramChats.find(item => item.chatId === message.chat.id);
        if (!chatInfo?.meta || !chatInfo?.tourplayName) {
            handleNewUser(message);
        }

        if (message.text === '/get_link') {
            botBloodBowl.sendMessage({
                chat_id: message.chat.id,
                text: getLeagueLink(),
                reply_parameters: {
                    message_id: message.message_id
                }
            });
        }

        if (message.text === '/update_fixtures') {
            const competition = await getCurrentFixtures();
            saveFixtures(competition);
            dataStorage.setItem('fixtures', competition);
        }

        if (message.text === '/start_votes') {
            sendVotesToEveryone();
        }
    });

    async function getTelegramChats(): Promise<telegramChatData[] | undefined> {
        const ret = await dataStorage.getItem<{ data: telegramChatData[] }>('telegramChats');
        return ret?.data;
    }

    async function handleNewUser(message: Message) {

        const telegramChats = await getTelegramChats();
        if (!telegramChats?.length) {
            return;
        }
        const chatInfo = telegramChats.find(item => item.chatId === message.chat.id);
        if (!chatInfo?.meta) {
            botBloodBowl.sendMessage({
                chat_id: message.chat.id,
                text: 'Введите своё тренерское имя'
            });
            updateChats({
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
                updateChats({
                    chatId: message.chat.id,
                    tourplayName: nameToCheck || "wableyuTeaEf",
                    meta: JSON.stringify(message.chat),
                    isAdmin: false,
                });
            } else {
                await botBloodBowl.sendMessage({
                    chat_id: message.chat.id,
                    text: 'Такого имени в лиге не найдено',
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

    async function updateChats(newValue: telegramChatData) {
        const telegramChats = await getTelegramChats();
        let toPush = [] as telegramChatData[];
        if (!telegramChats?.length) {
            uploadNewTelegramChat([newValue]);
            return;
        }
        const foundValueIndex = telegramChats.findIndex(item => {
            return (newValue.chatId && item.chatId === newValue.chatId) || (newValue.tourplayName && item.tourplayName === newValue.tourplayName)
        });
        if (foundValueIndex === -1) {
            toPush = [...telegramChats, newValue];
        } else {
            toPush = telegramChats.filter(item => {
                return (!newValue.chatId || item.chatId !== newValue.chatId) && (!newValue.tourplayName || item.tourplayName !== newValue.tourplayName)
            });
            toPush.push(newValue);
        }
        await uploadNewTelegramChat(toPush, telegramChats.length);
        updateTelegramChatsStore();
    }

    async function sendVotesToEveryone() {
        const telegramChats = await getTelegramChats();
        const chats = telegramChats?.filter(chat => {
            return chat.tourplayName !== '' && chat.chatId;
        })
        
        chats?.forEach(chat => {
            sendVotesTo(chat.chatId);
        })
    }

    async function sendVotesTo(chatId: number) {
        const messageText = await getVotesMessage();

        const inlineKeyboard = await getInlineKeyboard(chatId);
        botBloodBowl.sendMessage({
            chat_id: chatId,
            text: messageText,
            reply_markup: {
                inline_keyboard: inlineKeyboard
            },
        });
    }

    async function getVotesMessage() {
        const fixtures = await getCurrentFixtures();

        const messageText = 'Матчи этой недели:\n' + fixtures.matches.map(match => {
            let retString = `${getTeamString(match.teamLocal)} vs ${getTeamString(match.teamVisitor)}`
            if (match.scoreResume) {
                let winnerteam = match.scoreResume.winner === 'Local' ? match.teamLocal : match.teamVisitor;
                retString += `**Winner**: ${winnerteam.teamName}!\n`
            }
            return retString
        }).join('\n');
        return messageText;
    }

    async function getInlineKeyboard(chatId: number) {
        const fixtures = await getCurrentFixtures();
        const votes = await getVotes();

        return fixtures.matches.map(match => {
            return [
                getKeyboardKey(match.teamLocal, 'Local', match),
                getKeyboardKey(match.teamVisitor, 'Visitor', match),
            ]
        });

        function getKeyboardKey(team: teamInfo, teamPosition: 'Local' | 'Visitor', match: match) {
            const hasVote = votes[chatId]?.[match.matchId] === teamPosition;
            const callbackData = `${match.matchId}|${teamPosition}`
            let retString = getTeamVoteString(team);
            if (match.scoreResume) {
                let winnerteam = match.scoreResume.winner === 'Local' ? match.teamLocal : match.teamVisitor;
                if (team === winnerteam) {
                    retString = ['**', retString, '** 🏆'].join('');
                }
            }
            if (hasVote) {
                retString = '👍' + retString;
            }
            return {
                text: retString,
                callback_data: callbackData
            };
        }
    }

    function getTeamString(team: teamInfo): string {
        return `${team.teamName} (${team.userNameToShow})`;
    }

    function getTeamVoteString(team: teamInfo): string {
        return `${team.teamName}`;
    }

    async function getVotes(): Promise<HashedVotes> {
        const votesData = await dataStorage.getItem('votes') as { data: HashedVotes };
        if (!votesData?.data) {
            const googleVotesData = await getGoogleVotes();
            return googleVotesData;
        } else {
            return votesData?.data;
        }
        return [];
    }
}