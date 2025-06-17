import { HowLongToBeatService, HowLongToBeatEntry } from 'howlongtobeat';

let hltbService = new HowLongToBeatService();

export async function searchForGame(name: string) {
    const response = await hltbService.search('Nioh');
    console.log(response);
    return response;
    
}

export async function getGameById(id: string) {
    const response = await hltbService.detail(id);
    console.log(response);
    return response;
}