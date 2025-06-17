import type { Question, Answer, QuestionsHashed } from "./types.ts";

import { google } from "googleapis";
import credentials from '@/creds.json';

const spreadsheetId = process.env.NUXT_BOT_VGCLUB_SPREADSHEET || '';

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

export async function getCurrentSuggestions() {
    const ret = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: "Предложенные игры!A2",
    });
    return ret;
}