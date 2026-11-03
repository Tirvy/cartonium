# Feature: Telegram / Better Auth

## What it does

Users authenticate primarily via Telegram Login Widget through the Better Auth Telegram plugin. Email/password is available for admins (signup disabled by default). Sessions are cookie-based Better Auth sessions; app profiles live in local Postgres (`profiles`).

## Where it lives

| Layer | Paths |
|-------|-------|
| Widget UI | `app/components/common/telegramLoginButton.vue` |
| Email login UI | `app/components/common/login.vue` |
| Middleware | `auth-required.ts`, `club-admin-reroute.global.ts` |
| Auth API | `server/api/auth/[...all].ts` |
| Auth config | `server/utils/auth.ts` |
| Client | `app/utils/auth-client.ts`, `app/composables/useAuthUser.ts` |
| Profile sync | `server/utils/upsert-profile.ts` (hooks on user create/update) |
| API authz | `server/utils/require-user.ts`, `server/utils/require-rights.ts` |
| Config | **dev server port 80**; `BETTER_AUTH_*`, `NUXT_BOT_TOKEN`, `NUXT_PUBLIC_BOT_LOGIN` |

## Data flow

1. Widget (`authClient.initTelegramWidget`) → `signInWithTelegram`.
2. Better Auth verifies Telegram HMAC, creates/links user + session cookie.
3. Database hook upserts `profiles` for the Better Auth user id.
4. Email login: `authClient.signIn.email` (no open signup unless `BETTER_AUTH_ALLOW_SIGNUP=true`).

## Business rules

- Dev often binds port **80** (`nuxt.config.ts` `devServer`) for Telegram widget domain rules; Telegram also requires a public HTTPS origin for the widget in many setups.
- `BETTER_AUTH_URL` / `NUXT_PUBLIC_SITE_URL` must match the exact browser origin.
- Protected routes use `middleware: 'auth-required'` (settings, info edit); `/admin*` via `club-admin-reroute.global.ts` + `useGetGlobalPermissions`.
- Mutating `/api/db/*` handlers enforce `requireUser` / club gamemaster / global admin (former RLS replacement).

## Extend safely

- Prefer extending Better Auth config / Telegram plugin options rather than reintroducing custom HMAC password flows.
- Never log or commit bot tokens or `BETTER_AUTH_SECRET`.
- When importing legacy Supabase users, run `npm run db:backfill-auth` so Telegram ids keep `profiles.id` — see [cutover.md](../cutover.md).
