import type { Answer, QuestionsHashed } from './types';
import sendBotError from './error';
import * as gApi from './api-google-sheets';
import * as hltbApi from './api-howlongtobeat';

export async function getCurrentSuggestions() {
    // let questions = await dataStorage.getItem<QuestionsHashed>('questions');
    // if (questions === null) {
    //     const response = await gApi.getCurrentSuggestions();
    //     if (response === true) {
    //         questions = await dataStorage.getItem<QuestionsHashed>('questions');
    //     } else {
    //         sendBotError("Couldnt fetch questions\n" + JSON.stringify(response));
    //     }
    // }
    // if (questions === null) {
    //     sendBotError("Couldnt fetch questions");
    //     return {};
    // }
    // return questions;
}

export async function getGameDetails(id: string) {
    console.log(id);
    const results = await hltbApi.searchForGame(id);
    console.log(results);
    return results;

    return await hltbApi.getGameById(id);
}