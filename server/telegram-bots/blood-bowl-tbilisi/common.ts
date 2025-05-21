import dataStorage from './storage';
import type { TelegramChatData, HashedVotes } from './types';
import * as gApi from './api-google-sheets';

export async function getTelegramChatsFromStore(): Promise<TelegramChatData[] | undefined> {
    const ret = await dataStorage.getItem<{ data: TelegramChatData[] }>('telegramChats');
    return ret?.data;
}

export async function getVotes(): Promise<HashedVotes> {
    const votesData = await dataStorage.getItem('votes') as { data: HashedVotes };
    if (votesData?.data) {
        return votesData?.data;
    } else {
        const googleVotesData = await gApi.getGoogleVotes();
        if (googleVotesData) {
            return googleVotesData;
        }
    }
    return [];
}

export async function setVotesToStore(votesData: HashedVotes) {

    await dataStorage.setItem('votes', {data: votesData});
}

export async function addNewChatData(newValue: TelegramChatData) {
    const telegramChats = await getTelegramChatsFromStore();
    if (!telegramChats?.length) {
        gApi.uploadNewTelegramChat([newValue]);
        return;
    }

    const existingChatIndex = telegramChats.findIndex(item => {
        return (newValue.chatId && item.chatId === newValue.chatId) || (newValue.tourplayName && item.tourplayName === newValue.tourplayName)
    });
    let toPush = [] as TelegramChatData[];
    if (existingChatIndex === -1) {
        toPush = [...telegramChats, newValue];
    } else {
        toPush = telegramChats.filter(item => {
            return (!newValue.chatId || item.chatId !== newValue.chatId) && (!newValue.tourplayName || item.tourplayName !== newValue.tourplayName)
        });
        toPush.push(newValue);
    }
    await gApi.uploadNewTelegramChat(toPush, telegramChats.length);
    await gApi.fetchChatsToStore();
}