# Data model

Sources of truth:

1. **Schema**: `server/db/schema/` + `server/db/migrations/` (Drizzle → local Postgres)
2. **Legacy reference**: `supabase/migrations/*.sql` (historical cloud dump; do not extend)
3. **UI/domain types**: `shared/types/frontend.ts`
4. **Mapping**: `server/transformers.ts` (`*FromDb` / `*ToDb`)

## Auth tables (Better Auth)

`user`, `session`, `account`, `verification` (+ Telegram plugin columns `telegramId` / `telegramUsername` on user/account).

## Domain tables

| Table | Role |
|-------|------|
| `gameboxes` | Global catalog |
| `clubs` / `clubs_settings` / `clubs_info` / `clubs_collections` | Club identity and content |
| `gatherings` / `gatherings_guests` | Sessions + RSVP |
| `profiles` | App profile; `id` = Better Auth `user.id` (text) |
| `profiles_club_rights` | Club roles |
| `tables` | Physical tables |
| `user_schedules` / `user_schedules_history` | Availability |
| `telegram_*` | Bot bindings / chats |

## Views

| View | Role |
|------|------|
| `gameboxes_with_club_id` | Gameboxes + club id array |
| `gatherings_with_guests` | Upcoming gatherings + guests/profiles/gamebox/owner |

## Auth identity bridge

Telegram Login Widget → Better Auth Telegram plugin → session cookie. Profile upserted into `profiles` on user create/update. Email/password admins use Better Auth credential accounts.

## Storage

Local files at `public/gamebox-pics/{id}`; public URL `/gamebox-pics/{id}`.
