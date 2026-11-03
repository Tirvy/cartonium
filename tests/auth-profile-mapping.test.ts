import { describe, expect, it, vi } from 'vitest'

vi.mock('#server/utils/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

vi.mock('#server/db', () => ({
  db: {},
}))

import { authUserToProfileValues } from '../server/utils/upsert-profile'
import { sessionUserToAppUser } from '../server/utils/require-user'

describe('Auth → domain identity mapping', () => {
  it('authUserToProfileValues maps Telegram user into profiles row', () => {
    const now = new Date('2026-01-02T00:00:00.000Z')
    const row = authUserToProfileValues(
      {
        id: 'usr_tg_1',
        name: 'Ada Lovelace',
        image: 'https://t.me/pic',
        telegramId: '12345',
        telegramUsername: 'ada',
      },
      'cartonis_bot',
      now,
    )

    expect(row).toEqual({
      id: 'usr_tg_1',
      updated_at: now,
      full_name: 'Ada Lovelace',
      avatar_url: 'https://t.me/pic',
      telegram_username: 'ada',
      bot_name: 'cartonis_bot',
      chat_id: 12345,
    })
  })

  it('authUserToProfileValues uses chat_id 0 for email-only users', () => {
    const row = authUserToProfileValues({
      id: 'usr_email',
      name: 'Admin',
      telegramId: null,
    })
    expect(row.chat_id).toBe(0)
    expect(row.telegram_username).toBeNull()
  })

  it('authUserToProfileValues falls back chat_id 0 for non-numeric telegramId', () => {
    const row = authUserToProfileValues({
      id: 'usr_bad',
      telegramId: 'not-a-number',
    })
    expect(row.chat_id).toBe(0)
  })

  it('sessionUserToAppUser mirrors former Supabase user_metadata shape', () => {
    const appUser = sessionUserToAppUser({
      id: 'usr_1',
      email: '8306595751@telegram.placeholder.invalid',
      name: 'Ada Lovelace',
      image: '/a.png',
      telegramId: '8306595751',
      telegramUsername: 'ada',
    })

    expect(appUser.id).toBe('usr_1')
    expect(appUser.user_metadata).toEqual({
      telegram_id: '8306595751',
      full_name: 'Ada Lovelace',
      first_name: 'Ada',
      avatar_url: '/a.png',
      picture: '/a.png',
      telegram_username: 'ada',
    })
  })
})
