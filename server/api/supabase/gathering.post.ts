import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event);

    const { data, error } = await client.from('gatherings').upsert(body, { onConflict: 'id' });
    if (error) {
        throw createError({ statusMessage: error.message })
    }

    return data
})
