# Project structure

Where things live and where to put new work. Path inventory: `CODE_MAP.md`.

## Root

| Path | Purpose |
|------|---------|
| `app/` | Nuxt app (pages, components, composables, layouts, middleware, plugins, utils) |
| `server/` | Nitro API, utils, plugins, telegram bots, transformers, Drizzle DB |
| `shared/types/` | Shared TS types (`frontend.ts`) |
| `server/db/` | Drizzle client, schema, migrations, seed |
| `supabase/migrations/` | **LEGACY** cloud schema reference only — do not add new domain SQL here |
| `i18n/locales/` | `translations.csv` (source); `*.json` generated/gitignored |
| `public/` | Static assets (`gamebox-pics/`, `club-avatars/`, privacy, favicons) |
| `tests/` | Vitest unit tests (DB transformers/schema/auth mapping) |
| `docs/` | Architecture and feature docs for humans/agents |
| `AGENTS.md` | Agent entrypoint instructions |
| `CODE_MAP.md` | Compact path→role map |
| `nuxt.config.ts` | Modules, i18n, port 80 |
| `vuetify.config.ts` | Themes / component defaults |
| `.env.dist` | Env template (copy to `.env`) |

## `app/` guidance

| Put here | Examples |
|----------|----------|
| New club screen | `app/pages/clubs/[clubname]/<feature>/` |
| Reusable UI for a feature | `app/components/pages/<feature>/` |
| Cross-feature UI | `app/components/common/` or `app/components/` |
| Shared client logic | `app/composables/useX.ts` |
| Pure helpers / form rules | `app/utils/` |
| Route guards | `app/middleware/` (global `*.global.ts`) |
| Layout chrome | `app/layouts/` (`default`, `login`, `in-da-club`) |

**Existing feature homes**

- Gatherings: `app/pages/clubs/[clubname]/gatherings/` + `app/components/pages/gatherings/`
- Collection / add-games: `.../collection/` + `app/components/pages/add-games/`
- Settings / tables / themes: `.../settings/`
- Schedules: `.../profile/schedules/` + `app/components/pages/schedule/`
- Admin catalog: `app/pages/admin/`

## `server/` guidance

| Put here | Examples |
|----------|----------|
| Club/domain CRUD | `server/api/db/*.ts` |
| External game DBs | `server/api/bgg/`, `server/api/tesera/` |
| Auth | `server/api/auth/[...all].ts`, `server/utils/auth.ts` |
| Pictures / health | `server/api/common/`, `server/api/health.get.ts` |
| Row mappers | `server/transformers.ts` |
| Rights / notify | `server/utils/require-rights.ts`, `telegram-notify.ts` |
| Side bots | `server/telegram-bots/<bot>/` |

Prefer `.get.ts` / `.post.ts` suffixes for new handlers.

## `shared/types/`

| File | Use |
|------|-----|
| `frontend.ts` | UI/domain interfaces (`GameBox`, `Club`, `Gathering`, …) |
| `index.d.ts` | Nitro `$Fetch` typing hook |
| `visit.d.ts` | Legacy `Visit` (unused by app) |

Schema types come from Drizzle (`server/db/schema`), not generated Supabase types.

## Where NOT to put things

- Do not add Pinia stores — use composables + `useState`.
- Do not put SQL in the client; use Nitro APIs.
- Do not edit generated `i18n/locales/*.json`; edit `translations.csv`.
- Do not start new top-level folders for features that belong under `app/pages/clubs/...`.
- Do not add new domain schema under `supabase/migrations/`.
