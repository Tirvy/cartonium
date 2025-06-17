import type { CompetitionBloodBowl, MatchDataToSheet, TelegramChatData, BloodBowlVote, HashedVotes } from "./types";


import { google } from "googleapis";
import credentials from '@/creds.json';
import dataStorage from './storage';

const spreadsheetId = process.env.NUXT_BOT_BLOODBOWL_SPREADSHEET || '';

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

export async function saveFixtures(competition: CompetitionBloodBowl) {
    const dataToSave = {
        data: [{
            range: "fixtures!A2",
            values: competitionToSheet(competition).map(data => {
                return Object.values(data)
            }),
        }],
        valueInputOption: "RAW",
    };

    await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: spreadsheetId,
        requestBody: dataToSave,
    });
}

function competitionToSheet(competition: CompetitionBloodBowl): MatchDataToSheet[] {
    return competition.matches.map(match => {
        return {
            matchId: match.matchId,
            round: match.roundNumber,
            Local: [
                match.teamLocal.teamName,
                match.teamLocal.teamRace,
                match.teamLocal.userNameToShow,
            ].join(' | '),
            Visitor: [
                match.teamVisitor.teamName,
                match.teamVisitor.teamRace,
                match.teamVisitor.userNameToShow,
            ].join(' | '),
            result: match.scoreResume ? match.scoreResume.winner : undefined,
        }
    })
}

export async function fetchChatsToStore() {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: "chats names!A:D",
    });
    const dataToSend = {
        data: response.data.values?.slice(1).map(item => {
            return {
                chatId: +item[0],
                tourplayName: item[1],
                meta: item[2] ? JSON.parse(item[2]) : "",
                isAdmin: item[3] === 'TRUE',
            }
        }) || [],
    };
    await dataStorage.setItem('telegramChats', dataToSend);
}

export async function uploadNewTelegramChat(data: TelegramChatData[], lengthToUpdate?: number) {
    const values = data.map(item => Object.values(item)) as string[][];
    values.forEach(arr => arr[2] = JSON.stringify(arr[2]));

    if (lengthToUpdate) {
        while (values.length < lengthToUpdate) {
            values.push(['', '', '', ''])
        }
    }

    sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: "chats names!A2",
        valueInputOption: 'RAW',
        requestBody: {
            values: values,
        },
    });
}

export async function saveVoteToGoogle(vote: BloodBowlVote) {
    const values = [Object.values(vote)];
    const ret = await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: "predictions!A2",
        valueInputOption: 'RAW',
        requestBody: {
            values: values,
        },
    });
    return ret.statusText === 'OK';
}

export async function getGoogleVotes(): Promise<HashedVotes> {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: "predictions!A:D",
    });
    const votesData = response.data.values?.slice(1).map(item => {
        return {
            chatId: +item[0],
            matchId: +item[1],
            choise: item[2],
            date: +item[3],
        }
    });

    if (!votesData) {
        await dataStorage.setItem('votes', { data: {} });
        return {};
    } 
    
    const hashed = votesData.reduce((acc: HashedVotes, item) => {
        if (!acc[item.chatId]) {
            acc[item.chatId] = {};
        }
        acc[item.chatId][item.matchId] = item.choise;
        return acc;
    }, {});

    await dataStorage.setItem('votes', hashed);
    return hashed;
}