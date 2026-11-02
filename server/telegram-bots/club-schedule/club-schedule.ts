import botClubSchedule from './bot-object';
export default botClubSchedule;

import { getClubBinding, isClubId, setClubBinding } from './bindings';
import {
  fetchUpcomingGatherings,
  findProfileIdByTelegramChatId,
  formatGatheringsMessage,
} from './gatherings';

const START_RE = /^\/start(?:@\w+)?(?:\s+(.+))?$/i;
const SCHEDULE_RE = /^\/schedule(?:@\w+)?$/i;

async function reply(chatId: number, text: string) {
  await botClubSchedule.sendMessage({
    chat_id: chatId,
    text,
  });
}

async function handleStart(chatId: number, payload: string | undefined) {
  const clubId = payload?.trim();

  if (!clubId) {
    const current = await getClubBinding(chatId);
    if (current) {
      await reply(
        chatId,
        `Текущий клуб: «${current.clubTitle}».\n\nЧтобы сменить клуб:\n/start <club_id>\n\nСписок сборов:\n/schedule`,
      );
      return;
    }
    await reply(
      chatId,
      'Привяжите клуб командой:\n/start <club_id>\n\nПосле этого /schedule покажет предстоящие сборы.',
    );
    return;
  }

  if (!isClubId(clubId)) {
    await reply(chatId, 'Некорректный club_id. Ожидается UUID клуба.');
    return;
  }

  try {
    const binding = await setClubBinding(chatId, clubId);
    await reply(
      chatId,
      `Клуб «${binding.clubTitle}» привязан.\nКоманда /schedule покажет предстоящие сборы.`,
    );
  } catch (err: any) {
    if (err?.message === 'club_not_found') {
      await reply(chatId, 'Клуб с таким id не найден.');
      return;
    }
    if (err?.message === 'invalid_club_id') {
      await reply(chatId, 'Некорректный club_id. Ожидается UUID клуба.');
      return;
    }
    console.error('club-schedule /start error', err);
    await reply(chatId, 'Не удалось привязать клуб. Попробуйте позже.');
  }
}

async function handleSchedule(chatId: number, telegramUserId: number) {
  try {
    const binding = await getClubBinding(chatId);
    if (!binding) {
      await reply(
        chatId,
        'Клуб ещё не привязан.\nСначала выполните:\n/start <club_id>',
      );
      return;
    }

    const [gatherings, profileId] = await Promise.all([
      fetchUpcomingGatherings(binding.clubId),
      findProfileIdByTelegramChatId(telegramUserId),
    ]);

    await reply(
      chatId,
      formatGatheringsMessage(binding.clubTitle, gatherings, profileId),
    );
  } catch (err) {
    console.error('club-schedule /schedule error', err);
    await reply(chatId, 'Не удалось загрузить сборы. Попробуйте позже.');
  }
}

if (botClubSchedule) {
  botClubSchedule.startPolling();

  botClubSchedule.on('message', async (message) => {
    const text = message.text?.trim();
    if (!text) {
      return;
    }

    const chatId = message.chat.id;
    const startMatch = text.match(START_RE);
    if (startMatch) {
      await handleStart(chatId, startMatch[1]);
      return;
    }

    if (SCHEDULE_RE.test(text)) {
      await handleSchedule(chatId, message.from?.id ?? chatId);
      return;
    }
  });
}
