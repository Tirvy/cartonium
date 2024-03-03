import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event);

    const { data, error } = await client.from('clubs_info').upsert(body, { onConflict: 'club_id' });
    if (error) {
        throw createError({ statusMessage: error.message })
    }

    return data
})

// gets: {club_id, text_html}