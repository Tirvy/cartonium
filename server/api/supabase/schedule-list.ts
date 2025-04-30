import { serverSupabaseUser, serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import { scheduleFromSupabase } from '~/server/transformers'
import type { Schedule } from '~/types/frontend';

export default defineEventHandler(async (event): Promise<Schedule[]> => {
    const client = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);
    
    if (!user) {
        throw 'up325';
    }

    const schedulesRet = await client.from('user_schedules').select().eq('owner_id', user.id);
    if (schedulesRet.error) {
        throw 'up21';
    }

    const retValue = schedulesRet.data.map(scheduleFromSupabase);

    return retValue;
})
