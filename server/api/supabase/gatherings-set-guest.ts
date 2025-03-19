import { serverSupabaseUser, serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import { gatheringFromSupabase } from '~/server/transformers';
import telegramNotify from '~/server/utils/telegram-notify';
import { H3Event } from 'h3';
import type { PostgrestResponse, PostgrestSingleResponse } from '@supabase/postgrest-js';
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

  if (previousDataResponse?.data) {
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
  const username = user.user_metadata.full_name;

  const userPrevData = previousData.find(item => { item.user_id === user.id });
  const userPrevGuests = userPrevData?.guests_number;
  const userNewGuests = newData.guests_number;

  if (!userPrevData || userPrevGuests === 0) {
    message = `${username} joined`
    if (userNewGuests > 1) {
      message += ` with ${userNewGuests - 1} guests`;
    }
  } else if (newData?.guests_number === 0) {
    message = `${username} left`
  } else if (userPrevGuests) {
    message = `${username} has changed number of guests from ${userPrevGuests - 1} to ${userNewGuests - 1}`
  }
  return message
}
