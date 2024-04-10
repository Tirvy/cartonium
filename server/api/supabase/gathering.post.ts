import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import { gatheringFromSupabase } from '~/server/transformers'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event)
    const body = await readBody(event);

    const { data, error } = await client.from('gatherings').upsert(body, { onConflict: 'id' }).select().single();
    if (error) {
        throw createError({ statusMessage: error.message })
    }

    return gatheringFromSupabase(data);
})
