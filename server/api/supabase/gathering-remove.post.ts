import { serverSupabaseUser, serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import { gatheringFromSupabase } from '~/server/transformers'
import telegramNotify from '~/server/utils/telegram-notify';
import { isJson } from '~/utils/helpers';

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event)
    const user = await serverSupabaseUser(event);

    if (!user) {
        throw createError({ statusMessage: 'User not found' })
    }
    const body = await readBody(event);

    const gatheringGuests = await client.from('gatherings_with_guests').select().eq("id", body.gathering_id);

    const retGuests = await client.from('gatherings_guests').delete().eq("gathering_id", body.gathering_id);
    const retGathering = await client.from('gatherings').delete().eq("id", body.gathering_id);


    if (retGathering.error) {
        throw createError({ statusMessage: retGathering.error.message })
    }

    gatheringGuests.data?.forEach(item => {
        if (item.guests_number && item.guests_number >= 1) {
            const message = getMessage(item);
            telegramNotify(event, {
                to: user.user_metadata.telegram_id,
                bot_name: process.env.NUXT_PUBLIC_BOT_LOGIN,
                type: 'gathering-removed',
                why: `because i can`,
                what: message,
            })
        }
    });

    return [];
})

function getMessage(gatheringData: Database['public']['Views']['gatherings_with_guests']['Row']) {
    let message = 'Gathering for ';
    message += `*${(gatheringData.gamebox?.title || gatheringData.own_name)}*`;
    if (gatheringData.start_date) {
        const date = (new Date(gatheringData.start_date)).toLocaleDateString();
        message += ' at ' + date;
    }
    message += ':\n';

    message += 'has been *canceled*';
    return message;
}