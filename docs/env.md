# Environment variables

Copy `.env.dist` → `.env` and fill values. Never commit `.env` or `creds.json`.

## Required for core app

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Local/domain Postgres connection string for Drizzle |
| `BETTER_AUTH_SECRET` | Better Auth signing secret (≥32 chars) |
| `BETTER_AUTH_URL` / `NUXT_PUBLIC_SITE_URL` | **Exact** public browser origin. Must be `https://…` when TLS is terminated by a reverse proxy or tunnel; mismatches break cookies/CSRF |
| `NUXT_BOT_TOKEN` | Telegram bot token for Login Widget HMAC |
| `NUXT_PUBLIC_BOT_LOGIN` | Telegram bot username (no `@`) for the widget |

## Local Postgres (docker compose)

| Variable | Purpose |
|----------|---------|
| `POSTGRES_USER` | Compose Postgres user (default `cartonium`) |
| `POSTGRES_PASSWORD` | Compose Postgres password |
| `POSTGRES_DB` | Database name |
| `POSTGRES_PORT` | Host port mapped to 5432 |

Start DB: `npm run db:up` then `npm run db:migrate` then `npm run db:seed`. See [cutover.md](./cutover.md).

## Better Auth extras

| Variable | Purpose |
|----------|---------|
| `BETTER_AUTH_TRUSTED_ORIGINS` | Extra allowed origins (comma-separated). `NUXT_PUBLIC_SITE_URL` is always included when set |
| `BETTER_AUTH_ALLOW_SIGNUP` | Set to `true` to enable `POST /api/auth/sign-up/email` (default disabled) |

## Seed / storage

| Variable | Purpose |
|----------|---------|
| `SEED_CLUB_URL_NAME` / `SEED_CLUB_TITLE` | Default club for `npm run db:seed` (`terra`) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Optional first admin + gamemaster right |
| `SEED_ADMIN_TELEGRAM_ID` | Optional Telegram id on seeded admin |
| `GAMEBOX_PICS_DIR` | Absolute dir for BGG thumbnails (served via `/gamebox-pics/:id`) |

## Optional / bots / Docker

| Variable | Purpose |
|----------|---------|
| `NUXT_BOT_LOGER_TOKEN` | Logger bot |
| `NUXT_BOT_BLOODBOWL_TOKEN` | Blood Bowl bot |
| `NUXT_BOT_BLOODBOWL_SPREADSHEET` | Sheet id for BB data |
| `NUXT_BOT_BLOODBOWL_LEAGUE` | Tourplay league id |
| `NUXT_BOT_LUBA_TOKEN` | Luba quiz bot |
| `NUXT_BOT_LUBA_SPREADSHEET` | Luba questions sheet |
| `NUXT_BOT_FLOODREADER_TOKEN` | Flood-reader bot |
| `NUXT_BOT_SCHEDULE_TOKEN` | Club-schedule bot |
| `GOOGLE_CREDS_URL` | Docker build fetches Google creds |
| `NITRO_PORT` / `PORT` | Container listen port |

## Local notes

- Dev server: `host: 0.0.0.0`, **port 80** (Telegram Login domain rules).
- Domain schema: `server/db/schema` → `npm run db:generate` / `db:migrate`.
- Gamebox images: `GAMEBOX_PICS_DIR` or `public/gamebox-pics/{id}` (+ Nitro route in production).
- Health: `GET /api/health` runs `SELECT 1`.
