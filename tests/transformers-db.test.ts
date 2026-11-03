import { describe, expect, it } from 'vitest'
import {
  clubFromDb,
  gameBoxFromDb,
  gameBoxToDb,
  gatheringFromDb,
  gatheringWithGuestsFromDb,
  scheduleFromDb,
  tablesFromDb,
} from '../server/transformers'

describe('DB transformers (snake_case → camelCase)', () => {
  it('clubFromDb flattens clubs + clubs_settings', () => {
    const club = clubFromDb(
      { id: 'club-1', title: 'Terra', url_name: 'terra' },
      {
        themes: { primary: '#111' },
        avatar_url: '/a.png',
        guest_can_gather_own: true,
        guest_can_reserve: false,
        collection_search_rating: true,
        collection_search_duration: false,
        collection_search_players: true,
        reservation_links: ['https://x'],
        reservation_phones: ['123'],
        gathering_warning: 'be nice',
      },
    )

    expect(club).toMatchObject({
      id: 'club-1',
      title: 'Terra',
      urlName: 'terra',
      avatarUrl: '/a.png',
      guestCanGatherOwn: true,
      guestCanReserve: false,
      gatheringWarning: 'be nice',
      reservationLinks: ['https://x'],
      reservationPhones: ['123'],
    })
  })

  it('gameBoxFromDb / gameBoxToDb round-trip key fields', () => {
    const row = {
      id: 42,
      title: 'Root',
      titles: ['Root', 'Корни'],
      alias_tesera: 'root',
      id_bgg: 237182,
      id_tesera: 1,
      photo_url: 'https://example/pic.jpg',
      rating_bgg: 8.1,
      rating_tesera: 8.0,
      players_min: 2,
      players_max: 4,
      players_good: [3, 4],
      playtime_min: 60,
      playtime_max: 90,
      playtime_avg: 75,
      year: 2018,
      link_bgg: 'https://bgg/root',
      link_tesera: 'https://tesera/root',
      club_id: ['club-a'],
    }

    const ui = gameBoxFromDb(row)
    expect(ui.id).toBe(42)
    expect(ui.aliasTesera).toBe('root')
    expect(ui.clubId).toEqual(['club-a'])
    expect(ui.playersGood).toEqual([3, 4])

    const back = gameBoxToDb(ui)
    expect(back).toMatchObject({
      id: 42,
      title: 'Root',
      alias_tesera: 'root',
      id_bgg: 237182,
      titles: ['Root', 'Корни'],
    })
  })

  it('gameBoxFromDb sets clubId null when column absent', () => {
    const ui = gameBoxFromDb({ id: 1, title: 'X', titles: [] })
    expect(ui.clubId).toBeNull()
  })

  it('gatheringFromDb maps owner and schedule fields', () => {
    const g = gatheringFromDb({
      id: 9,
      owner_id: 'user-text-id',
      start_date: '2026-01-01T18:00:00Z',
      comment_owner: 'hi',
      guests_max: 5,
      comment_club: '',
      club_id: 'club-1',
      table_id: 3,
      own_name: null,
      gamebox_id: 42,
    })

    expect(g).toMatchObject({
      id: 9,
      ownerId: 'user-text-id',
      guestsMax: 5,
      clubId: 'club-1',
      tableId: 3,
      gameboxId: 42,
    })
  })

  it('gatheringWithGuestsFromDb builds guest from profile metadata', () => {
    const row = {
      id: 1,
      club_id: 'club-1',
      comment_club: '',
      comment_owner: '',
      table_id: null,
      guests_max: 4,
      owner_id: 'owner-1',
      owneruser: { id: 'owner-1', metadata: { full_name: 'Owner' } },
      start_date: '2026-02-01T12:00:00Z',
      own_name: null,
      user_id: 'guest-1',
      guests_number: 2,
      avatar_url: '/g.png',
      telegram_username: 'guest',
      raw_user_meta_data: { first_name: 'Guest', full_name: 'Guest User' },
      gamebox: {
        id: 7,
        title: 'Wingspan',
        titles: ['Wingspan'],
        photo_url: null,
        alias_tesera: 'wingspan',
      },
    }

    const g = gatheringWithGuestsFromDb(row)
    expect(g.gameboxId).toBe(7)
    expect(g.gamebox.title).toBe('Wingspan')
    expect(g.slotsFilled).toBe(2)
    expect(g.guests).toHaveLength(1)
    expect(g.guests[0]).toMatchObject({
      id: 'guest-1',
      title: 'Guest',
      totalGuests: 2,
      telegramUsername: 'guest',
    })
  })

  it('tablesFromDb and scheduleFromDb map nested history', () => {
    expect(
      tablesFromDb({
        id: 1,
        club_id: 'c',
        title: 'A1',
        description: 'big',
        people_max: 8,
      }),
    ).toEqual({
      id: 1,
      clubId: 'c',
      title: 'A1',
      description: 'big',
      peopleMax: 8,
    })

    expect(
      scheduleFromDb({
        id: 2,
        title: 'Week',
        visibility: 'hidden',
        history: [{ segments: [true, false] }],
      }),
    ).toEqual({
      id: 2,
      title: 'Week',
      visibility: 'hidden',
      history: [{ segments: [true, false] }],
    })
  })
})
