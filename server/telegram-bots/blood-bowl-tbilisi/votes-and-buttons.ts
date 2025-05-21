import { getTelegramChatsFromStore, getVotes } from './common';
import type { TeamBloodBowl, MatchBloodBowl } from './types';
import type { CallbackQuery } from 'typescript-telegram-bot-api/dist/types';
import { getCurrentFixtures } from './api-tourplay';
import botBloodBowl from './blood-bowl-predicter';
import sendBloodBowlError from './error';

export async function sendVotesToEveryone() {
    const telegramChats = await getTelegramChatsFromStore();
    const chats = telegramChats?.filter(chat => {
        return chat.tourplayName !== '' && chat.chatId;
    })

    chats?.forEach(chat => {
        sendVotesTo(chat.chatId);
    })
}

export async function sendVotesTo(chatId: number) {
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

    function getKeyboardKey(team: TeamBloodBowl, teamPosition: 'Local' | 'Visitor', match: MatchBloodBowl) {
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

function getTeamString(team: TeamBloodBowl): string {
    return `${team.teamName} (${team.userNameToShow})`;
}

function getTeamVoteString(team: TeamBloodBowl): string {
    return `${team.teamName}`;
}

export async function updateMessageButtons(query: CallbackQuery) {
    const chat = query.from;

    let creds = getCredsFromCallbackQuery(query);
    if (!creds) {
        botBloodBowl.answerCallbackQuery({
            callback_query_id: query.id,
            text: 'Ошибка кредов (бага)',
            show_alert: true,
        });
        sendBloodBowlError(chat.id, 'Ошибка кредов');
        return;
    }
    const keyboard = await getInlineKeyboard(chat.id);
    botBloodBowl.editMessageReplyMarkup({
        ...creds,
        reply_markup: {
            inline_keyboard: keyboard
        },
    });
}

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