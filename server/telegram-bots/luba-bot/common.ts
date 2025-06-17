import dataStorage from './storage';
import type { Answer, QuestionsHashed } from './types';
import sendBotError from './error';
import * as gApi from './api-google-sheets';

export async function getQuestionsHashed(): Promise<QuestionsHashed> {
    let questions = await dataStorage.getItem<QuestionsHashed>('questions');
    if (questions === null) {
        const response = await gApi.fetchQuestionsToLocalStore();
        if (response === true) {
            questions = await dataStorage.getItem<QuestionsHashed>('questions');
        } else {
            sendBotError("Couldnt fetch questions\n" + JSON.stringify(response));
        }
    }
    if (questions === null) {
        sendBotError("Couldnt fetch questions");
        return {};
    }
    return questions;
}

export async function saveAnswer(answer: Answer) {
    await gApi.saveAnswerToGoogle({
        ...answer,
    })
}