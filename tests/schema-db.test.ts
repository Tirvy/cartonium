import { describe, expect, it } from 'vitest'
import { getTableColumns, getTableName } from 'drizzle-orm'
import {
  account,
  gatherings,
  gatheringsGuests,
  gameboxesWithClubId,
  gatheringsWithGuests,
  profiles,
  session,
  user,
  userSchedules,
  verification,
} from '../server/db/schema'

describe('Drizzle domain + Better Auth schema', () => {
  it('exposes Better Auth core tables', () => {
    expect(getTableName(user)).toBe('user')
    expect(getTableName(session)).toBe('session')
    expect(getTableName(account)).toBe('account')
    expect(getTableName(verification)).toBe('verification')
  })

  it('stores Better Auth telegram identity columns on user/account', () => {
    const userCols = getTableColumns(user)
    expect(userCols.telegramId.name).toBe('telegram_id')
    expect(userCols.telegramUsername.name).toBe('telegram_username')

    const accountCols = getTableColumns(account)
    expect(accountCols.telegramId.name).toBe('telegram_id')
    expect(accountCols.password.name).toBe('password')
  })

  it('uses text ids for auth-linked domain columns (not uuid FK to auth.users)', () => {
    const profileCols = getTableColumns(profiles)
    expect(profileCols.id.name).toBe('id')
    expect(profileCols.id.columnType).toBe('PgText')
    expect(profileCols.chat_id.name).toBe('chat_id')

    const gatheringCols = getTableColumns(gatherings)
    expect(gatheringCols.owner_id.columnType).toBe('PgText')

    const guestCols = getTableColumns(gatheringsGuests)
    expect(guestCols.user_id.columnType).toBe('PgText')

    const scheduleCols = getTableColumns(userSchedules)
    expect(scheduleCols.owner_id.columnType).toBe('PgText')
  })

  it('registers replacement views for former matviews', () => {
    expect(gameboxesWithClubId).toBeTruthy()
    expect(gatheringsWithGuests).toBeTruthy()
    // drizzle stores the SQL name on the view config
    const gbName =
      (gameboxesWithClubId as { [key: symbol]: unknown })[Symbol.for('drizzle:Name')] ??
      (gameboxesWithClubId as { _: { name?: string } })._?.name
    const gwName =
      (gatheringsWithGuests as { [key: symbol]: unknown })[Symbol.for('drizzle:Name')] ??
      (gatheringsWithGuests as { _: { name?: string } })._?.name
    expect(gbName).toBe('gameboxes_with_club_id')
    expect(gwName).toBe('gatherings_with_guests')
  })
})

