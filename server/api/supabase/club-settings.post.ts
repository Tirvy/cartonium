import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase.js'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event)
    const body = await readBody(event);

    const { data, error } = await client.from('clubs_settings').upsert(body, { onConflict: 'club_id' }).select().single();
    if (error) {
        throw createError({ statusMessage: error.message })
    }
    return (data);
})
