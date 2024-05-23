import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase.js'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event)
    const body = await readBody(event);

    const { data, error } = await client.from('tables').upsert(body, { onConflict: 'id' }).select();
    if (error) {
        throw createError({ statusMessage: error.message })
    }

    return data
})