import { serverSupabaseUser, serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server';
import telegramPasswordGenerator from '~/server/utils/telegram-password-generator';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const query = getQuery(event);
  const tgData = query as unknown as TelegramLoginPayload;
  console.timeEnd('logister ' + query.username);
  console.time('logister ' + query.username);
  const authed = checkTelegramAuth(tgData);
  console.timeLog('logister ' + query.username);
  if (!authed) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Not authed',
    });
  }

  const imagineryPassword = telegramPasswordGenerator(tgData);
  console.timeLog('logister ' + query.username);
  let singInRes = await client.auth.signInWithPassword({
    email: `${tgData.id}@tgauth-happens.com`,
    password: imagineryPassword,
  });
  // console.timeLog('logister ' + query.username);
  // if (!singInRes.error) {
  //   const updateRes = await client.auth.updateUser({
  //     data: getMetadataObject(tgData),
  //   })
  // } else {
  //   throw createError({
  //     statusCode: 500,
  //     statusMessage: 'Error loggin in',
  //   });
  // }

  console.timeLog('logister ' + query.username);
  const sessionSource = singInRes?.data?.session;
  if (sessionSource) {
    console.log(7);
    const urlParams = new URLSearchParams({
      telegram_access_token: sessionSource.access_token,
      telegram_refresh_token: sessionSource.refresh_token,
    });
    console.timeEnd('logister ' + query.username);
    return { url: query.next + '?' + urlParams };
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