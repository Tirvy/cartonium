import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';
import type { H3Event, EventHandlerRequest } from 'h3';

export default async function profileClubRights(event: H3Event<EventHandlerRequest>) {
    const client = await serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);

    if (user?.id) {
        let clubs = await client.from('profiles_club_rights').select('club_id')
            .eq('profile_id', user.id);
        return clubs;
    }
    return [];
}