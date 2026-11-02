// import botBloodBowl from '~/server/telegram-bots/blood-bowl-tbilisi/blood-bowl';

// botBloodBowl

// import botFloodReader from '~/server/telegram-bots/flood-reader/flood-reader';

// botFloodReader

// import botLuba from '~/server/telegram-bots/luba-bot/luba-bot';

// botLuba

import botClubSchedule from '~/server/telegram-bots/club-schedule/club-schedule';

export default defineNitroPlugin((nitroApp) => {
    console.log("tgbots: Checking bots launches...");
    const bots = {
        botClubSchedule,
    } as { [key: string]: any };
    Object.keys(bots).forEach(botname => {
        if (bots[botname]) {
            console.log(`${botname} launch success\n`)
        }
    })
    console.log("tgbots: done\n");
})
