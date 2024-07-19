import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase.js'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient<Database>(event);
    const query = getQuery(event);
    const userid = query.userid as string;
    const clubid = query.clubid as string;
    if (!userid || !clubid) {
        return [];
    }

    let profile = await client.from('profiles').select('*')
        .eq('id', userid).single();
    if (profile.error) {
        throw createError({ statusMessage: profile.error.message })
    }

    let clubs = await client.from('profiles_club_rights').select('*')
        .eq('profile_id', userid).eq('club_id', clubid);
    if (clubs.error) {
        throw createError({ statusMessage: clubs.error.message })
    }

    return clubs.data;
})