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

    const retGuests = await client.from('gatherings_guests').delete().eq("gathering_id", body.gathering_id);
    const retGathering = await client.from('gatherings').delete().eq("id", body.gathering_id);

    if (retGathering.error) {
        throw createError({ statusMessage: retGathering.error.message })
    }

    return [];
})
