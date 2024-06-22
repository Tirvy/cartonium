import { serverSupabaseUser, serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server';
import telegramPasswordGenerator from '~/server/utils/telegram-password-generator';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const query = getQuery(event);
  const tgData = query as unknown as TelegramLoginPayload;
  const authed = checkTelegramAuth(tgData);
  const imagineryPassword = telegramPasswordGenerator(tgData);
  if (!authed) {
    return;
    throw createError({
      statusCode: 400,
      statusMessage: 'Not authed',
    });
  }

  if (authed) {
    let singInRes = null;
    let signUpRes = await client.auth.signUp(
      {
        email: `${tgData.id}@tgauth-happens.com`,
        password: imagineryPassword,
        options: {
          data: getMetadataObject(tgData),
        }
      }
    );
    if (signUpRes.error?.message === 'User already registered') {
      singInRes = await client.auth.signInWithPassword({
        email: `${tgData.id}@tgauth-happens.com`,
        password: imagineryPassword,
      });
      if (!singInRes.error) {
        const updateRes = await client.auth.updateUser({
          data: getMetadataObject(tgData),
        })
      }
    }


    const sessionSource = singInRes?.data?.session ?? signUpRes?.data?.session;
    if (sessionSource) {
      await sendRedirect(event, getNextRoute(query.next as string, {
        telegram_access_token: sessionSource.access_token,
        telegram_refresh_token: sessionSource.refresh_token,
      }));
    }
    return;
    throw createError({
      statusCode: 400,
      statusMessage: 'No user',
    });
  }
})

function getNextRoute(next: string, queryParams: any): string {
  let ret = `${next}`;
  if (ret[0] !== '/') {
    ret = `/${ret}`;
  }
  if (ret.includes('?')) {
    ret += '&';
  } else {
    ret += '?';
  }
  ret += Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join('&');
  return ret;
}

function getMetadataObject(tgData: TelegramLoginPayload) {
  return {
    telegram_id: tgData.id,
    full_name: [tgData.first_name, tgData.last_name].filter(Boolean).join(' '),
    first_name: tgData.first_name,
    avatar_url: tgData.photo_url,
    picture: tgData.photo_url,
    telegram_username: tgData.username,
    is_imaginery: true,
  }
}