import botTelegram from './bot-object';
export default botTelegram;
import sendBotError from './error';
import type { Question, Answer, StoredState, QuestionsHashed } from './types';
import { getCurrentSuggestions, getGameDetails } from './common';

if (botTelegram) {
    botTelegram.startPolling();

    botTelegram.on('message', async function (message) {
        if (message.text === '/start') {
            botTelegram.sendMessage({
                chat_id: message.chat.id,
                text: 'Hi!',
            })
            return;
        }

        const getGameDataComand = '/gg ';
        if (message.text?.startsWith(getGameDataComand)) {
            const steamlink = message.text.slice(getGameDataComand.length);
            console.log(steamlink);
            if (steamlink.length < 10) {
                console.log('shit');
                return;
            }

            const gameNameReg = steamlink.match(/\/([^\/]+)\/(\?|$)/);
            if (gameNameReg?.length && gameNameReg.length > 1) {
                const gameName = gameNameReg[1].replaceAll('_', " ");
                const deatils = await getGameDetails(gameName);
            }

            // const regMatch = steamlink.match(/\/(\d+)\//gm);
            // const gameId = regMatch?.find(item => {
            //     if (item?.length > 3) {
            //         const numbersOnly = item.slice(1, -1);
            //         console.log(numbersOnly);
            //         return !isNaN(+numbersOnly)
            //     }
            // });
            // console.log(gameId, regMatch);
            // if (gameId) {
            //     const details = await getGameDetails(gameId);
            //     console.log(details);
            //     return details;
            // }
            return;
        }

        botTelegram.forwardMessage({
            chat_id: 327078611,
            from_chat_id: message.chat.id,
            message_id: message.message_id,
        });
        return 1;
    });
}
