import botBloodBowl from '~/server/telegram-bots/blood-bowl-tbilisi/blood-bowl';

botBloodBowl

import botFloodReader from '~/server/telegram-bots/flood-reader/flood-reader';

botFloodReader

import botLuba from '~/server/telegram-bots/luba-bot/luba-bot';

botLuba


export default defineNitroPlugin((nitroApp) => {
    console.log("Checking bots launches...");
    const bots = { botBloodBowl, botFloodReader, botLuba } as { [key: string]: any };
    Object.keys(bots).forEach(botname => {
        if (bots[botname]) {
            console.log(`${botname} launch success\n`)
        }
    })
})
