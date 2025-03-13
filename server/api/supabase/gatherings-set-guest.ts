import { serverSupabaseUser, serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/supabase.js'
import { gatheringFromSupabase } from '~/server/transformers';
import telegramBots from '~/server/utils/telegram-bots';
import sendTelegramMessage from '~/server/utils/messages-store';

import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key', {
  // Provide a custom schema. Defaults to "public".
  db: { schema: 'other_schema' }
})

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({ statusMessage: 'User not found' })
  }
  const body = await readBody(event);

  const previousDataResponse = await client.from('gatherings_guests').select()
    .eq('gathering_id', body.gathering_id).eq('user_id', body.guest_id).single();

  const { data, error } = await client.from('gatherings_guests').upsert(
    {
      gathering_id: body.gathering_id,
      user_id: body.guest_id,
      guests_number: body.number,
    }, { onConflict: 'gathering_id, user_id' }).select().single();

  if (!previousDataResponse.data || previousDataResponse.data.guests_number === 0) {
    sendTelegramMessage(event, {
      to: user.user_metadata.telegram_id,
      bot_name: process.env.NUXT_PUBLIC_BOT_LOGIN,
      type: 'gathering-player-change',
      why: `${user.user_metadata.telegram_id} joined`,
      what: `${user.user_metadata.telegram_id} joined`,
    });
  }

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return { status: 'ok' };
})
