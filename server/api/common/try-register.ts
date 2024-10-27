import { serverSupabaseUser, serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server';
import telegramPasswordGenerator from '~/server/utils/telegram-password-generator';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const query = getQuery(event);
  const tgData = query as unknown as TelegramLoginPayload;
  const authed = checkTelegramAuth(tgData);
  console.time('register ' + query.id);
  if (!authed) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Not authed',
    });
  }

  const imagineryPassword = telegramPasswordGenerator(tgData);
  console.timeLog('register ' + query.id);
  let signUpRes = await client.auth.signUp(
    {
      email: `${tgData.id}@tgauth-happens.com`,
      password: imagineryPassword,
      options: {
        data: getMetadataObject(tgData),
      }
    }
  );

  console.timeLog('register ' + query.id);
  const sessionSource = signUpRes?.data?.session;
  console.timeLog('register ' + query.id);
  if (sessionSource) {
    console.log(7);
    const urlParams = new URLSearchParams({
      telegram_access_token: sessionSource.access_token,
      telegram_refresh_token: sessionSource.refresh_token,
    });
    console.log(8);
    console.log(query.next + '?' + urlParams);
    const returnValue = query.next + '?' + urlParams;
    console.log(9, returnValue);
    return { url: returnValue };
    console.log(10);
  }

  console.log(10);
  throw createError({
    statusCode: 400,
    statusMessage: 'No user',
  });
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