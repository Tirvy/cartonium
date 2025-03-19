import { serverSupabaseUser, serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import telegramNotify from '~/server/utils/telegram-notify';
import type { User } from '@supabase/auth-js';

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({ statusMessage: 'User not found' })
  }
  const body = await readBody(event);

  const previousDataResponse = await client.from('gatherings_with_guests').select()
    .eq('id', body.gathering_id).eq('user_id', body.guest_id);

  const { data, error } = await client.from('gatherings_guests').upsert(
    {
      gathering_id: body.gathering_id,
      user_id: body.guest_id,
      guests_number: body.number,
    }, { onConflict: 'gathering_id, user_id' }).select().single();

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  if (previousDataResponse.data?.length) {
    const message = creatMessage(user, data, previousDataResponse?.data);

    telegramNotify(event, {
      to: user.user_metadata.telegram_id,
      bot_name: process.env.NUXT_PUBLIC_BOT_LOGIN,
      type: 'gathering-player-change',
      why: `because i can`,
      what: message,
    });
  }

  return { status: 'ok' };
})

function creatMessage(user: User, newData: Database['public']['Tables']['gatherings_guests']['Row'], previousData: Database['public']['Views']['gatherings_with_guests']['Row'][]) {
  let message = 'Gathering for ';

  const userPrevData = previousData.find(item => item.user_id === user.id);
  const userPrevGuests = userPrevData?.guests_number;
  const userNewGuests = newData.guests_number;
  const gatheringData: Database['public']['Views']['gatherings_with_guests']['Row'] = previousData[0];

  const gamebox = gatheringData.gamebox as Database['public']['Tables']['gameboxes']['Row'];
  message += `*${(gamebox?.title || gatheringData.own_name)}*`;

  if (gatheringData.start_date) {
    const date = (new Date(gatheringData.start_date)).toLocaleDateString();
    message += ' at ' + date;
  }
  message += ':\n';

  let username = user.user_metadata.full_name;
  if (user.user_metadata.telegram_username) {
    username += ` @${user.user_metadata.telegram_username}`;
  }
  if (!userPrevData || userPrevGuests === 0) {
    message += `${username} joined`
    if (userNewGuests > 1) {
      message += ` with ${userNewGuests - 1} guests`;
    }
  } else if (newData?.guests_number === 0) {
    message += `${username} left`
  } else if (userPrevGuests) {
    message += `${username} has changed number of their guests from ${userPrevGuests - 1} to ${userNewGuests - 1}`
  }
  return message
}
