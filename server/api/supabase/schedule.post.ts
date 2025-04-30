import { serverSupabaseUser, serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import { gatheringFromSupabase } from '~/server/transformers'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event)
    const user = await serverSupabaseUser(event);

    if (!user) {
        throw createError({ statusMessage: 'User not found' })
    }
    const body = await readBody(event);

    let scheduleId = body.id;

    if (!scheduleId) {
        const retCreate = await client.from('user_schedules').insert(
            {
                title: body.title,
                archive: false,
                visibility: 'hidden',
                owner_id: user.id,
            }).select().single();
        if (retCreate.error) {

        } else {
            scheduleId = retCreate.data.id
        }
    } else if (body.title) {
        const retRename = await client.from('user_schedules').update(
            {
                id: scheduleId,
                title: body.title,
            }).eq('id', scheduleId).select().single();
            console.log(retRename);
    }

    const { data, error } = await client.from('user_schedules_history').insert(
        {
            schedule_id: scheduleId,
            start_date: body.startDate,
            segment_size: 60,
            segments: body.segments,
        }).select().single();
    if (error) {
        throw createError({ statusMessage: error.message })
    }

    return scheduleId;
})
