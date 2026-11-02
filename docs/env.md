# Environment variables

Copy `.env.dist` → `.env` and fill values. Never commit `.env` or `creds.json`.

## Required for core app

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/public key used by Nuxt module |
| `SUPABASE_SERVICE_KEY` | Service-role key (Nitro tasks, club-schedule bot DB access) |
| `npm_config_supabase_id` | Project ref for `execs/supabase-type.sh` / type gen |
| `NUXT_BOT_TOKEN` | Telegram bot token for Login Widget HMAC + `botPublic` |
| `NUXT_TELEGRAM_PASSWORD_GENERATOR` | Secret for deterministic TG→Supabase passwords |

## Optional / bots / Docker

| Variable | Purpose |
|----------|---------|
| `NUXT_BOT_LOGER_TOKEN` | Logger bot (Docker ARG; `telegram-bots.ts`) |
| `NUXT_BOT_BLOODBOWL_TOKEN` | Blood Bowl bot |
| `NUXT_BOT_BLOODBOWL_SPREADSHEET` | Sheet id for BB data |
| `NUXT_BOT_BLOODBOWL_LEAGUE` | Tourplay league id |
| `NUXT_BOT_LUBA_TOKEN` | Luba quiz bot |
| `NUXT_BOT_LUBA_SPREADSHEET` | Luba questions sheet |
| `NUXT_BOT_FLOODREADER_TOKEN` | Flood-reader bot (if enabled) |
| `NUXT_BOT_SCHEDULE_TOKEN` | Club-schedule bot (`/start`, `/schedule`) |
| `GOOGLE_CREDS_URL` | Docker build fetches Google creds |
| `SUPABASE_ACCESS_TOKEN` | Docker typegen / supabase CLI |
| `NITRO_PORT` / `PORT` | Container listen port |
| `runtimeConfig.public.botLogin` | Set via Nuxt env naming if used for widget bot username |

## Validation

No runtime schema validator (e.g. zod) is wired today. Missing TG secrets break login; missing Supabase vars break the app at startup/request time. Add validation only if explicitly requested.

## Local notes

- Dev server: `host: 0.0.0.0`, **port 80** (Telegram login).
- `$development` sets supabase cookies `secure: false`.
- Typegen: `npx supabase login` then `npm run type` or `sh execs/supabase-type.sh`.
