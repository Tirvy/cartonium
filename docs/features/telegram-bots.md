# Feature: Optional Telegram bots

## What it does

Side bots (not the main club app notify bot) live under `server/telegram-bots/`. The Nitro plugin `server/plugins/telegram-bots-starter.ts` currently sets `bots={}` — **nothing auto-starts**.

## Bots

| Bot | Role | Key deps |
|-----|------|----------|
| `blood-bowl-tbilisi` | League match prediction votes | Tourplay API, Google Sheet, `NUXT_BOT_BLOODBOWL_*` |
| `luba-bot` | English quiz from sheet | Google Sheet `NUXT_BOT_LUBA_*` |
| `flood-reader` | TTS experiment stub | polling only; handlers commented |

Shared notify/login bots use `NUXT_BOT_TOKEN` / `NUXT_BOT_LOGER_TOKEN` via `server/utils/telegram-bots.ts`.

## Extend safely

- Do not enable bots in the starter plugin without an explicit request and env/credentials review.
- Google clients expect `creds.json` (gitignored) and spreadsheet env vars.
- Keep bot code isolated from club domain APIs unless intentionally integrating.
