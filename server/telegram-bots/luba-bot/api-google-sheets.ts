import type { Question, Answer, QuestionsHashed } from "./types.ts";
import dataStorage from './storage';


import { google } from "googleapis";
import credentials from '@/creds.json';

const spreadsheetId = process.env.NUXT_BOT_LUBA_SPREADSHEET || '';

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

export async function fetchQuestionsToLocalStore(): Promise<true | string> {

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: "QuestionsList",
    });
    if (!response.data.values) {
        return 'wrong values';
    }
    const questions = response.data.values.slice(1).map(item => {
        const variants = item.slice(3);
        const rightAnswer = item[2];
        const rightAnswerIndex = variants.indexOf(rightAnswer);
        if (rightAnswerIndex === -1) {
            console.error('No right answer');// todo san
        }

        return {
            theme: item[0] as string,
            text: item[1] as string,
            variants: variants as string[],
            trueAnswer: rightAnswerIndex,
        }
    });
    const questionsHashed = questions?.reduce((acc, item) => {
        if (!acc[item.theme]) {
            acc[item.theme] = [item]
        } else {
            acc[item.theme].push(item);
        }

        return acc;
    }, {} as QuestionsHashed);
    await dataStorage.setItem<QuestionsHashed>('questions', questionsHashed);
    console.log('BotLuba: questions updated')
    return true;
}

export async function saveAnswerToGoogle(answer: Answer) {
    const values = [Object.values(answer)];
    const ret = await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: "Ответы!A2",
        valueInputOption: 'RAW',
        requestBody: {
            values: values,
        },
    });
    return ret.statusText === 'OK';
}