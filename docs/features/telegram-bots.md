# Feature: Optional Telegram bots

## What it does

Side bots (not the main club app notify bot) live under `server/telegram-bots/`. The Nitro plugin `server/plugins/telegram-bots-starter.ts` starts bots that are registered there (currently `club-schedule` when `NUXT_BOT_SCHEDULE_TOKEN` is set).

## Bots

| Bot | Role | Key deps |
|-----|------|----------|
| `club-schedule` | Club gatherings list via Telegram | Postgres (`DATABASE_URL`), `NUXT_BOT_SCHEDULE_TOKEN` |
| `blood-bowl-tbilisi` | League match prediction votes | Tourplay API, Google Sheet, `NUXT_BOT_BLOODBOWL_*` |
| `luba-bot` | English quiz from sheet | Google Sheet `NUXT_BOT_LUBA_*` |
| `flood-reader` | TTS experiment stub | polling only; handlers commented |

### club-schedule

Commands:

- `/start <club_id>` — bind this Telegram chat to a club (UUID). Persisted in `telegram_bot_club_bindings`.
- `/schedule` — short list of upcoming gatherings for the bound club (same window as the guest gatherings table).

Shared notify/login bots use `NUXT_BOT_TOKEN` / `NUXT_BOT_LOGER_TOKEN` via `server/utils/telegram-bots.ts`.

## Extend safely

- Do not enable additional bots in the starter plugin without an explicit request and env/credentials review.
- Google clients expect `creds.json` (gitignored) and spreadsheet env vars.
- Keep bot code isolated from club domain APIs unless intentionally integrating.
