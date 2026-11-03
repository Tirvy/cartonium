import { describe, expect, it, vi } from 'vitest'

vi.mock('#server/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => []),
        })),
      })),
    })),
  },
}))

vi.mock('#server/utils/require-user', () => ({
  default: vi.fn(),
}))

import { CLUB_GAMEMASTER } from '../server/utils/require-rights'

describe('require-rights constants', () => {
  it('uses gamemaster relation_type matching former RLS', () => {
    expect(CLUB_GAMEMASTER).toBe('gamemaster')
  })
})
