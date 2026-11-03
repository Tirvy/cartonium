import { sql } from 'drizzle-orm'
import {
  bigint,
  boolean,
  check,
  date,
  integer,
  jsonb,
  json,
  pgTable,
  pgView,
  primaryKey,
  real,
  smallint,
  text,
  timestamp,
  uuid,
  unique,
} from 'drizzle-orm/pg-core'

export * from './auth'

/** Snake_case field names match existing transformers / API bodies. */
export const gameboxes = pgTable(
  'gameboxes',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
    title: text('title').notNull(),
    photo_url: text('photo_url'),
    id_tesera: bigint('id_tesera', { mode: 'number' }),
    id_bgg: bigint('id_bgg', { mode: 'number' }),
    rating_tesera: real('rating_tesera'),
    rating_bgg: real('rating_bgg'),
    link_tesera: text('link_tesera'),
    link_bgg: text('link_bgg'),
    year: smallint('year'),
    players_min: smallint('players_min'),
    players_max: smallint('players_max'),
    players_good: smallint('players_good').array(),
    playtime_min: smallint('playtime_min'),
    playtime_max: smallint('playtime_max'),
    playtime_avg: smallint('playtime_avg'),
    alias_tesera: text('alias_tesera'),
    titles: text('titles').array().default(sql`'{}'::text[]`).notNull(),
  },
  (t) => [
    unique('gameboxes_alias_tesera_key').on(t.alias_tesera),
    unique('gameboxes_id_bgg_key').on(t.id_bgg),
  ],
)

export const clubs = pgTable('clubs', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  title: text('title').notNull(),
  url_name: text('url_name').notNull(),
})

export const clubsCollections = pgTable(
  'clubs_collections',
  {
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    game_box_id: bigint('game_box_id', { mode: 'number' }).notNull(),
    club_id: uuid('club_id').notNull(),
  },
  (t) => [primaryKey({ columns: [t.game_box_id, t.club_id] })],
)

export const clubsInfo = pgTable('clubs_info', {
  club_id: uuid('club_id').primaryKey(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  text_html: text('text_html').notNull(),
  text_delta: jsonb('text_delta').default(sql`'{}'::jsonb`).notNull(),
})

export const clubsSettings = pgTable('clubs_settings', {
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  club_id: uuid('club_id').primaryKey(),
  themes: json('themes').default(sql`'{}'::json`),
  avatar_url: text('avatar_url').default(''),
  guest_can_reserve: boolean('guest_can_reserve').default(false).notNull(),
  guest_can_gather_own: boolean('guest_can_gather_own').default(false).notNull(),
  collection_search_rating: boolean('collection_search_rating').default(true),
  collection_search_players: boolean('collection_search_players').default(true),
  collection_search_duration: boolean('collection_search_duration').default(true),
  reservation_links: text('reservation_links').array().default(sql`'{}'::text[]`).notNull(),
  reservation_phones: text('reservation_phones').array().default(sql`'{}'::text[]`).notNull(),
  gathering_warning: text('gathering_warning').default('').notNull(),
})

export const gatherings = pgTable('gatherings', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  owner_id: text('owner_id').notNull(),
  start_date: timestamp('start_date', { withTimezone: true }),
  comment_owner: text('comment_owner').default('').notNull(),
  guests_max: bigint('guests_max', { mode: 'number' }).notNull(),
  comment_club: text('comment_club').default('').notNull(),
  club_id: uuid('club_id').notNull(),
  table_id: bigint('table_id', { mode: 'number' }),
  own_name: text('own_name'),
  gamebox_id: bigint('gamebox_id', { mode: 'number' }),
})

export const gatheringsGuests = pgTable(
  'gatherings_guests',
  {
    gathering_id: bigint('gathering_id', { mode: 'number' }).notNull(),
    user_id: text('user_id').notNull(),
    guests_number: smallint('guests_number').notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.gathering_id, t.user_id] }),
    check('gatherings_guests_guests_number_check', sql`${t.guests_number} >= 0`),
  ],
)

/** App profile; id matches Better Auth `user.id` (text). */
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  full_name: text('full_name'),
  avatar_url: text('avatar_url'),
  telegram_username: text('telegram_username'),
  bot_name: text('bot_name').default('').notNull(),
  chat_id: integer('chat_id').default(0).notNull(),
})

export const profilesClubRights = pgTable('profiles_club_rights', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  relation_type: text('relation_type').notNull(),
  profile_id: text('profile_id'),
  club_id: uuid('club_id'),
})

export const tables = pgTable('tables', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  club_id: uuid('club_id').notNull(),
  title: text('title').default('').notNull(),
  description: text('description').default('').notNull(),
  people_max: bigint('people_max', { mode: 'number' }).default(32).notNull(),
})

export const telegramChats = pgTable(
  'telegram_chats',
  {
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    user_id: text('user_id').notNull(),
    bot_name: text('bot_name').notNull(),
    chat_id: integer('chat_id').notNull(),
  },
  (t) => [primaryKey({ columns: [t.user_id, t.bot_name] })],
)

export const telegramChatsLogs = pgTable('telegram_chats_logs', {
  admin_name: text('admin_name').primaryKey(),
  bot_token: text('bot_token').notNull(),
  chat_id: integer('chat_id').notNull(),
})

export const userSchedules = pgTable('user_schedules', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  owner_id: text('owner_id').notNull(),
  visibility: text('visibility').notNull(),
  archive: boolean('archive').default(false).notNull(),
  title: text('title').notNull(),
})

export const userSchedulesHistory = pgTable('user_schedules_history', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  schedule_id: bigint('schedule_id', { mode: 'number' }).notNull(),
  start_date: date('start_date').notNull(),
  segment_size: integer('segment_size').default(30).notNull(),
  segments: boolean('segments').array().notNull(),
})

export const telegramBotClubBindings = pgTable(
  'telegram_bot_club_bindings',
  {
    chat_id: bigint('chat_id', { mode: 'number' }).notNull(),
    bot_name: text('bot_name').notNull(),
    club_id: uuid('club_id')
      .notNull()
      .references(() => clubs.id, { onDelete: 'cascade' }),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.chat_id, t.bot_name] })],
)

/** Replaces gameboxes_with_club_id matview. */
export const gameboxesWithClubId = pgView('gameboxes_with_club_id', {
  id: bigint('id', { mode: 'number' }),
  title: text('title'),
  photo_url: text('photo_url'),
  id_tesera: bigint('id_tesera', { mode: 'number' }),
  id_bgg: bigint('id_bgg', { mode: 'number' }),
  rating_tesera: real('rating_tesera'),
  rating_bgg: real('rating_bgg'),
  link_tesera: text('link_tesera'),
  link_bgg: text('link_bgg'),
  year: smallint('year'),
  players_min: smallint('players_min'),
  players_max: smallint('players_max'),
  players_good: smallint('players_good').array(),
  playtime_min: smallint('playtime_min'),
  playtime_max: smallint('playtime_max'),
  playtime_avg: smallint('playtime_avg'),
  alias_tesera: text('alias_tesera'),
  titles: text('titles').array(),
  club_id: uuid('club_id').array(),
}).as(sql`
  SELECT
    gameboxes.id,
    gameboxes.title,
    gameboxes.photo_url,
    gameboxes.id_tesera,
    gameboxes.id_bgg,
    gameboxes.rating_tesera,
    gameboxes.rating_bgg,
    gameboxes.link_tesera,
    gameboxes.link_bgg,
    gameboxes.year,
    gameboxes.players_min,
    gameboxes.players_max,
    gameboxes.players_good,
    gameboxes.playtime_min,
    gameboxes.playtime_max,
    gameboxes.playtime_avg,
    gameboxes.alias_tesera,
    gameboxes.titles,
    ARRAY(
      SELECT clubs_collections.club_id
      FROM clubs_collections
      WHERE clubs_collections.game_box_id = gameboxes.id
    ) AS club_id
  FROM gameboxes
`)

/**
 * Replaces gatherings_with_guests matview.
 * Guest/owner display uses profiles instead of auth.users metadata.
 */
export const gatheringsWithGuests = pgView('gatherings_with_guests', {
  id: bigint('id', { mode: 'number' }),
  created_at: timestamp('created_at', { withTimezone: true }),
  owner_id: text('owner_id'),
  start_date: timestamp('start_date', { withTimezone: true }),
  comment_owner: text('comment_owner'),
  guests_max: bigint('guests_max', { mode: 'number' }),
  comment_club: text('comment_club'),
  club_id: uuid('club_id'),
  table_id: bigint('table_id', { mode: 'number' }),
  own_name: text('own_name'),
  gamebox_id: bigint('gamebox_id', { mode: 'number' }),
  user_id: text('user_id'),
  guests_number: smallint('guests_number'),
  raw_user_meta_data: jsonb('raw_user_meta_data'),
  telegram_username: text('telegram_username'),
  full_name: text('full_name'),
  avatar_url: text('avatar_url'),
  gamebox: jsonb('gamebox'),
  owneruser: jsonb('owneruser'),
}).as(sql`
  SELECT
    g.id,
    g.created_at,
    g.owner_id,
    g.start_date,
    g.comment_owner,
    g.guests_max,
    g.comment_club,
    g.club_id,
    g.table_id,
    g.own_name,
    g.gamebox_id,
    gg.user_id,
    gg.guests_number,
    jsonb_build_object(
      'full_name', p.full_name,
      'first_name', split_part(COALESCE(p.full_name, ''), ' ', 1),
      'avatar_url', p.avatar_url,
      'telegram_username', p.telegram_username,
      'picture', p.avatar_url
    ) AS raw_user_meta_data,
    p.telegram_username,
    p.full_name,
    p.avatar_url,
    jsonb_build_object(
      'id', gb.id,
      'title', gb.title,
      'photo_url', gb.photo_url,
      'id_tesera', gb.id_tesera,
      'id_bgg', gb.id_bgg,
      'rating_tesera', gb.rating_tesera,
      'rating_bgg', gb.rating_bgg,
      'link_tesera', gb.link_tesera,
      'link_bgg', gb.link_bgg,
      'year', gb.year,
      'players_min', gb.players_min,
      'players_max', gb.players_max,
      'players_good', gb.players_good,
      'playtime_min', gb.playtime_min,
      'playtime_max', gb.playtime_max,
      'playtime_avg', gb.playtime_avg,
      'alias_tesera', gb.alias_tesera,
      'titles', gb.titles
    ) AS gamebox,
    jsonb_build_object(
      'id', owner.id,
      'metadata', jsonb_build_object(
        'full_name', owner.full_name,
        'first_name', split_part(COALESCE(owner.full_name, ''), ' ', 1),
        'avatar_url', owner.avatar_url,
        'telegram_username', owner.telegram_username,
        'picture', owner.avatar_url
      )
    ) AS owneruser
  FROM gatherings g
  LEFT JOIN (
    SELECT gathering_id, user_id, guests_number
    FROM gatherings_guests
    WHERE guests_number > 0
  ) gg ON g.id = gg.gathering_id
  LEFT JOIN profiles p ON gg.user_id = p.id
  LEFT JOIN profiles owner ON g.owner_id = owner.id
  LEFT JOIN gameboxes gb ON g.gamebox_id = gb.id
  WHERE g.start_date >= (CURRENT_DATE - INTERVAL '1 day')
`)
