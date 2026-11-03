# Environment variables

Copy `.env.dist` → `.env` and fill values. Never commit `.env` or `creds.json`.

## Required for core app

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Local/domain Postgres connection string for Drizzle |
| `SUPABASE_URL` | Supabase project URL (Auth + Storage) |
| `SUPABASE_KEY` | Supabase anon/public key used by Nuxt module |
| `SUPABASE_SERVICE_KEY` | Service-role key (legacy pgmq task / optional bots) |
| `NUXT_BOT_TOKEN` | Telegram bot token for Login Widget HMAC + `botPublic` |
| `NUXT_TELEGRAM_PASSWORD_GENERATOR` | Secret for deterministic TG→Supabase Auth passwords |

## Local Postgres (docker compose)

| Variable | Purpose |
|----------|---------|
| `POSTGRES_USER` | Compose Postgres user (default `cartonium`) |
| `POSTGRES_PASSWORD` | Compose Postgres password |
| `POSTGRES_DB` | Database name |
| `POSTGRES_PORT` | Host port mapped to 5432 |

Start DB: `npm run db:up` then `npm run db:migrate`.

## Optional / bots / Docker

| Variable | Purpose |
|----------|---------|
| `npm_config_supabase_id` | Project ref for optional Auth-era type gen |
| `NUXT_BOT_LOGER_TOKEN` | Logger bot (Docker ARG; `telegram-bots.ts`) |
| `NUXT_BOT_BLOODBOWL_TOKEN` | Blood Bowl bot |
| `NUXT_BOT_BLOODBOWL_SPREADSHEET` | Sheet id for BB data |
| `NUXT_BOT_BLOODBOWL_LEAGUE` | Tourplay league id |
| `NUXT_BOT_LUBA_TOKEN` | Luba quiz bot |
| `NUXT_BOT_LUBA_SPREADSHEET` | Luba questions sheet |
| `NUXT_BOT_FLOODREADER_TOKEN` | Flood-reader bot (if enabled) |
| `NUXT_BOT_SCHEDULE_TOKEN` | Club-schedule bot (`/start`, `/schedule`) |
| `GOOGLE_CREDS_URL` | Docker build fetches Google creds |
| `SUPABASE_ACCESS_TOKEN` | Optional supabase CLI |
| `NITRO_PORT` / `PORT` | Container listen port |
| `runtimeConfig.public.botLogin` | Set via Nuxt env naming if used for widget bot username |

## Validation

No runtime schema validator (e.g. zod) is wired today. Missing TG secrets break login; missing `DATABASE_URL` breaks domain APIs; missing Supabase vars break Auth/Storage.

## Local notes

- Dev server: `host: 0.0.0.0`, **port 80** (Telegram login).
- `$development` sets supabase cookies `secure: false`.
- Domain schema: edit `server/db/schema`, then `npm run db:generate` / `db:migrate`.
- Optional Auth typing: `npx supabase login` then `npm run type`.
