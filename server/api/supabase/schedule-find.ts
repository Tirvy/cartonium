import { serverSupabaseUser, serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import { scheduleFromSupabase } from '~/server/transformers'
import type { Schedule } from '~/types/frontend';

export default defineEventHandler(async (event): Promise<Schedule> => {
    const client = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);
    const id = +(getQuery(event).scheduleId as string);
    if (!id || isNaN(id) || !user) {
        throw 'up3';
    }
    const scheduleRet = await client.from('user_schedules').select().eq('owner_id', user.id).eq('id', id).single();
    if (scheduleRet.error) {
        throw 'up5';
    }
    const scheduleHistoryRet = await client.from('user_schedules_history').select().eq('id', id).order('created_at');
    if (scheduleRet.error) {
        throw 'up7';
    }

    const retValue = {
        ...scheduleRet.data,
        history: scheduleHistoryRet.data
    };

    return scheduleFromSupabase(retValue);
})
