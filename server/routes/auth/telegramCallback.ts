import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const authed = checkTelegramAuth(query as unknown as TelegramLoginPayload);
  if (authed) {
    //     await sendRedirect(event, `/${next.slice(1)}`, 303)

  }
})