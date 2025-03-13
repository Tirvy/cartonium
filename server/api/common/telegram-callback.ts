import { serverSupabaseClient } from '#supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import telegramPasswordGenerator from '~/server/utils/telegram-password-generator';
import type { User } from '@supabase/auth-js';
import telegramBots from '~/server/utils/telegram-bots';

const techChatId = 327078611;

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const query = getQuery(event);
  const tgData = query as unknown as TelegramLoginPayload;
  const authed = checkTelegramAuth(tgData);

  telegramBots.botLogger?.sendMessage({
    chat_id: techChatId,
    text: `login attempt from tgData:\n${JSON.stringify(tgData)}`
  })

  if (!authed) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Not authed',
    });
  }

  const imagineryPassword = telegramPasswordGenerator(tgData);
  const metaData = getMetadataObject(tgData);
  let singInRes = null;
  let signUpRes = await client.auth.signUp(
    {
      email: `${tgData.id}@tgauth-happens.com`,
      password: imagineryPassword,
      options: {
        data: metaData
      }
    }
  );

  if (!signUpRes.error) {
    telegramBots.botLogger?.sendMessage({
      chat_id: techChatId,
      text: `signup of ${tgData.id}${tgData.username ? ' - @'+tgData.username : ''} is successfull`
    })
  }

  if (signUpRes.error?.message === 'User already registered') {
    singInRes = await client.auth.signInWithPassword({
      email: `${tgData.id}@tgauth-happens.com`,
      password: imagineryPassword,
    });
    if (!singInRes.error) {
      await client.auth.updateUser({
        data: metaData,
      })
      telegramBots.botLogger?.sendMessage({
        chat_id: techChatId,
        text: `login of ${tgData.id} is successfull`
      })
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error loggin in',
      });
    }
  }

  const sessionSource = singInRes?.data?.session ?? signUpRes?.data?.session;
  if (sessionSource) {
    updateUserData(client, sessionSource.user, tgData);
    const urlParams = new URLSearchParams({
      telegram_access_token: sessionSource.access_token,
      telegram_refresh_token: sessionSource.refresh_token,
    });
    const returnValue = query.next + '?' + urlParams;
    return { url: returnValue };
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'No user',
  });
})

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

async function updateUserData(client: SupabaseClient, user: User, tgData: TelegramLoginPayload) {
  const ret = await client.from('profiles').upsert({
    id: user.id,
    updated_at: new Date(),
    full_name: [tgData.first_name, tgData.last_name].filter(Boolean).join(' '),
    avatar_url: tgData.photo_url,
    telegram_username: tgData.username,
    bot_name: process.env.NUXT_PUBLIC_BOT_LOGIN,
    chat_id: tgData.id,
  }, { onConflict: 'id' }).select();
}