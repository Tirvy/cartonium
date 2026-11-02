# Data model

Sources of truth:

1. **Schema**: `supabase/migrations/*.sql`
2. **Generated DB types**: `.generated/supabase-database.ts` (`npm run type`) + overrides in `shared/types/supabase.ts`
3. **UI/domain types**: `shared/types/frontend.ts`
4. **Mapping**: `server/transformers.ts`

Do not invent columns. Field lists below summarize what the app types/migrations expose.

## Entity relationship (app domain)

```mermaid
erDiagram
  clubs ||--o{ clubs_settings : has
  clubs ||--o{ clubs_info : has
  clubs ||--o{ clubs_collections : has
  clubs ||--o{ tables : has
  clubs ||--o{ gatherings : has
  gameboxes ||--o{ clubs_collections : in
  gatherings ||--o{ gatherings_guests : has
  gatherings }o--|| gameboxes : plays
  gatherings }o--o| tables : uses
  profiles ||--o{ profiles_club_rights : has
  clubs ||--o{ profiles_club_rights : grants
  profiles ||--o{ user_schedules : has
  user_schedules ||--o{ user_schedules_history : versions
```

## Tables (from migrations)

| Table | Role |
|-------|------|
| `gameboxes` | Global catalog (Tesera/BGG ids, titles, ratings, players, playtime) |
| `clubs` | Club identity (`title`, `url_name`) |
| `clubs_collections` | Club ↔ gamebox membership |
| `clubs_info` | Public/about HTML |
| `clubs_settings` | Themes, avatar, guest permissions, collection filter flags, reservation contacts |
| `gatherings` | Scheduled play (owner, club, table, gamebox, guest cap, comments, start) |
| `gatherings_guests` | RSVP rows (guest profile + count) |
| `profiles` | App profile (telegram fields, chat_id, etc.) |
| `profiles_club_rights` | `profile_id`, `club_id`, `relation_type` (e.g. `gamemaster` appears in RLS) |
| `tables` | Physical tables at a club |
| `telegram_chats` / `telegram_chats_logs` | Bot chat mappings |
| `user_schedules` / `user_schedules_history` | Named calendars + boolean segment snapshots |
| `profile` | Auth-synced profile (`email`, `full_name`, `avatar_url`, `terms_accepted_at`) from later migration |

## Views / matviews

| View | Role |
|------|------|
| `gameboxes_with_club_id` | Gameboxes + array of club ids |
| `gatherings_with_guests` | Upcoming gatherings joined with guests/profiles/gamebox/owner |
| `users_raw_data` | `auth.users` id + metadata |

## Frontend types (camelCase)

Defined in `shared/types/frontend.ts`. Important shapes:

- `Club` — settings flattened onto club for UI (`guestCanGatherOwn`, `avatarUrl`, reservation fields, collection search flags, …)
- `GameBox` / `GameBoxWithClub` — catalog card data
- `Gathering` / `GatheringWithGuests` / `GatheringGuest` / `GatheringComputedValue`
- `Table`, `Schedule` / `ScheduleHistoryItem`
- `GameboxAddData`, `GameBoxSearchResult`, `GameBoxDataTesera`, `GameBoxDataBgg`
- `TelegramNotification` — `{ to, type, why, what, bot_name }` with `type`: `gathering-player-change` \| `gathering-removed`

## Auth identity bridge

Telegram Login → HMAC verify (`NUXT_BOT_TOKEN`) → synthetic email `{telegramId}@tgauth-happens.com` + HMAC password (`NUXT_TELEGRAM_PASSWORD_GENERATOR`) → Supabase Auth user. Session tokens may arrive as `telegram_*_token` query params and are consumed by `app/middleware/set-session.global.ts`.

## Storage

- Bucket usage observed in code: `gamebox-pics` (thumbnails via `server/api/common/add-pictures.post.ts`).
- Picture URL helper: `app/utils/gamebox-picture-get.ts` (storage public URL else Tesera `photoUrl`).
