import { serverSupabaseClient } from '#supabase/server';
import type { Database } from '~/types/supabase.js'


export default defineEventHandler(async (event): Promise<string | undefined> => {
    const body = await readBody(event);
    const client = await serverSupabaseClient<Database>(event);

    const { data } = await <any>client.storage.from('gamebox-pics').getPublicUrl(body.id);
    if ('publicUrl' in data) {
        return data.publicUrl;
    } else if ('error' in data && 'message' in data) {
        throw createError({ statusMessage: data.message })
    }
});