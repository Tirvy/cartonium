# Project structure

Where things live and where to put new work. Path inventory: `CODE_MAP.md`.

## Root

| Path | Purpose |
|------|---------|
| `app/` | Nuxt app (pages, components, composables, layouts, middleware, plugins, utils) |
| `server/` | Nitro API, utils, plugins, tasks, telegram bots, transformers |
| `shared/types/` | Shared TS types (frontend domain + supabase overrides) |
| `supabase/migrations/` | Schema source of truth |
| `i18n/locales/` | `translations.csv` (source); `*.json` generated/gitignored |
| `public/` | Static assets (e.g. `privacy-policy.html`, favicons) |
| `execs/` | Shell helpers (types gen, docker build) |
| `docs/` | Architecture and feature docs for humans/agents |
| `AGENTS.md` | Agent entrypoint instructions |
| `CODE_MAP.md` | Compact path→role map |
| `nuxt.config.ts` | Modules, i18n, supabase redirects, port 80 |
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
| Club/domain CRUD | `server/api/supabase/*.ts` |
| External game DBs | `server/api/bgg/`, `server/api/tesera/` |
| Auth helpers / pictures | `server/api/common/` |
| Row mappers | `server/transformers.ts` |
| TG verify/notify | `server/utils/` |
| Scheduled drain | `server/tasks/` |
| Side bots | `server/telegram-bots/<bot>/` |

Prefer `.get.ts` / `.post.ts` suffixes for new handlers.

## `shared/types/`

| File | Use |
|------|-----|
| `frontend.ts` | UI/domain interfaces (`GameBox`, `Club`, `Gathering`, …) |
| `supabase.ts` | `Database` MergeDeep + `Tables` helpers over generated types |
| `index.d.ts` | Nitro `$Fetch` typing hook |
| `visit.d.ts` | Legacy `Visit` (unused by app) |

Generated DB file: `.generated/supabase-database.ts` (gitignored) via `npm run type`.

## Where NOT to put things

- Do not add Pinia stores — use composables + `useState`.
- Do not put SQL in the client; use Nitro APIs.
- Do not edit generated `i18n/locales/*.json`; edit `translations.csv`.
- Do not start new top-level folders for features that belong under `app/pages/clubs/...`.
