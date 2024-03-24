import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/supabase.js'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event)
    const body = await readBody(event);

    const { data, error } = await client.from('clubs_info').upsert(body, { onConflict: 'club_id' });
    if (error) {
        throw createError({ statusMessage: error.message })
    }

    return data
})

// gets: {club_id, text_html}