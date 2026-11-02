# Feature: Telegram / Supabase auth

## What it does

Users authenticate primarily via Telegram Login Widget. Server verifies the widget HMAC, ensures a Supabase user exists (synthetic email/password), and returns session tokens. Middleware applies tokens from the query string.

## Where it lives

| Layer | Paths |
|-------|-------|
| Widget UI | `app/components/common/telegramLoginButton.vue`, layouts |
| Callback page | `app/pages/auth/telegram-callback-page.vue` |
| Email login UI | `app/components/common/login.vue` (OAuth/guest flags largely off) |
| Confirm | `app/pages/confirm.vue` (Supabase redirect callback) |
| Middleware | `app/middleware/set-session.global.ts` |
| Server route | `server/routes/auth/telegram-callback.ts` (redirect) |
| APIs | `server/api/common/telegram-callback.ts`, `try-login.ts`, `try-register.ts`, `get-creds.ts` |
| Utils | `server/utils/check-telegram-auth.ts`, `telegram-password-generator.ts` |
| Config | `nuxt.config.ts` supabase redirectOptions; **dev server port 80** (required for TG login) |

## Data flow

1. Widget posts user payload to callback API/route.
2. `checkTelegramAuth` HMAC with `NUXT_BOT_TOKEN`.
3. Password from `telegram-password-generator` + `NUXT_TELEGRAM_PASSWORD_GENERATOR`.
4. signUp/signIn → URL with `telegram_access_token` / refresh (names as implemented).
5. `set-session.global` establishes Supabase session and strips tokens from the URL.

## Business rules

- Dev must bind port **80** (`nuxt.config.ts` `devServer`) for Telegram widget domain rules.
- Protected routes listed in `supabase.redirectOptions.include` (settings, info edit, admin).
- `/admin*` additionally gated by `club-admin-reroute.global.ts` + `useGetGlobalPermissions`.

## Extend safely

- Prefer fixing/extending one callback path rather than adding another copy of `getMetadataObject`.
- Never log or commit bot tokens or password generator secrets.
- `login.vue` `authByTelegram` is currently a stub (`console.log`) — real TG path is the widget → callback.
