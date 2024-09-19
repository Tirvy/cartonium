import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase.js'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);
    if (!user?.id ) {
        return [];
    }

    let clubs = await client.from('profiles_club_rights').select('*')
        .eq('profile_id', user.id);
    if (clubs.error) {
        throw createError({ statusMessage: clubs.error.message })
    }

    return clubs.data;
})