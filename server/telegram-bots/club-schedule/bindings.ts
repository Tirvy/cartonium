import supabase from './supabase';
import { BOT_NAME, type ClubBinding } from './types';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isClubId(value: string): boolean {
  return UUID_RE.test(value);
}

export async function getClubBinding(chatId: number): Promise<ClubBinding | null> {
  if (!supabase) {
    throw new Error('Supabase client is not configured (SUPABASE_URL / SUPABASE_SERVICE_KEY)');
  }

  const { data: binding, error } = await supabase
    .from('telegram_bot_club_bindings')
    .select('club_id')
    .eq('chat_id', chatId)
    .eq('bot_name', BOT_NAME)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!binding?.club_id) {
    return null;
  }

  const { data: club, error: clubError } = await supabase
    .from('clubs')
    .select('id, title, url_name')
    .eq('id', binding.club_id)
    .maybeSingle();

  if (clubError) {
    throw new Error(clubError.message);
  }
  if (!club) {
    return null;
  }

  return {
    chatId,
    clubId: club.id,
    clubTitle: club.title,
    clubUrlName: club.url_name,
  };
}

export async function setClubBinding(chatId: number, clubId: string): Promise<ClubBinding> {
  if (!supabase) {
    throw new Error('Supabase client is not configured (SUPABASE_URL / SUPABASE_SERVICE_KEY)');
  }
  if (!isClubId(clubId)) {
    throw new Error('invalid_club_id');
  }

  const { data: club, error: clubError } = await supabase
    .from('clubs')
    .select('id, title, url_name')
    .eq('id', clubId)
    .maybeSingle();

  if (clubError) {
    throw new Error(clubError.message);
  }
  if (!club) {
    throw new Error('club_not_found');
  }

  const { error } = await supabase.from('telegram_bot_club_bindings').upsert(
    {
      chat_id: chatId,
      bot_name: BOT_NAME,
      club_id: club.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'chat_id,bot_name' },
  );

  if (error) {
    throw new Error(error.message);
  }

  return {
    chatId,
    clubId: club.id,
    clubTitle: club.title,
    clubUrlName: club.url_name,
  };
}
