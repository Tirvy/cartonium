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

    const { data, error } = await client.from('gatherings').upsert(
        {
            ...body,
            with_host: undefined,
        }, { onConflict: 'id' }).select().single();
    if (error) {
        throw createError({ statusMessage: error.message })
    }

    const addinGuestsRes = await client.from('gatherings_guests').insert(
        {
            gathering_id: data.id,
            user_id: user.id,
            guests_number: (+body.with_host || 0) + 1,
        }
    );

    return gatheringFromSupabase(data);
})
