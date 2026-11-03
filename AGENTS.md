# AGENTS.md — Cartonium (Cartonis)

Concise instructions for AI coding agents. Prefer `CODE_MAP.md` for path inventories and `docs/` for deeper context.

## Overview

Boardgame club platform: organize gatherings (RSVP), manage game collections (Tesera/BGG), club settings/tables, user schedules, Telegram login/notifications. Product name in UI: **Cartonis**.

## Stack

| Layer | Tech |
|-------|------|
| App | Nuxt 4 (`nuxt` ^4.4), Vue 3, Vuetify (`vuetify-nuxt-module`) |
| Domain DB | Local Postgres + Drizzle (`DATABASE_URL`) |
| Auth | Better Auth (email/password + Telegram plugin); `/api/auth/*` |
| Storage | Local files under `public/gamebox-pics/` |
| i18n | `@nuxtjs/i18n` + `nuxt-translation-manager` (`i18n/locales/translations.csv`) |
| Server | Nitro API routes, optional Nitro tasks, Telegram bots (`typescript-telegram-bot-api`) |
| External | BoardGameGeek XML API, Tesera API, Google Sheets (bots) |
| Package manager | npm (`package-lock.json`) |
| Tests | none |

## Architecture principles

1. **File-based Nuxt routing** under `app/pages/`; club routes nest under `/clubs/[clubname]/`.
2. **Server owns DB access** — pages call `$fetch('/api/db/...')`; domain queries use Drizzle (`#server/db`). Client auth via `useAuthUser` / `authClient`.
3. **Transform at the boundary** — snake_case DB rows ↔ camelCase UI types in `server/transformers.ts` (`*FromDb` / `*ToDb`).
4. **Shared types** live in `shared/types/frontend.ts` (UI). Domain + auth schema in `server/db/schema`.
5. **No Pinia** — shared UI state uses Nuxt `useState` keys: `club`, `clubPermissions`, `lastGathering`, `lastGatheringName`.
6. **Telegram bots are optional** — `server/plugins/telegram-bots-starter.ts` currently starts none (`bots={}`).
7. **Identity** — Better Auth user id (`requireUser` / `useAuthUser`); write `owner_id` / profile ids explicitly.

## Project structure (short)

```
app/           pages, components, composables, layouts, middleware, plugins, utils
server/api/    Nitro handlers (db, bgg, tesera, common, auth)
server/db/     Drizzle client + schema + migrations (domain + Better Auth tables)
server/utils/  Better Auth instance, require-user, notify, rights
server/telegram-bots/  optional side bots
shared/types/  frontend types
supabase/migrations/  LEGACY cloud schema reference only
i18n/locales/  translations.csv → generated *.json (gitignored)
docs/          human/AI architecture docs
CODE_MAP.md    path → role inventory (token-efficient)
docker-compose.yml  local Postgres
public/gamebox-pics/  local gamebox images
```

## Coding conventions

- Vue SFCs: `<script lang="ts" setup>`, Vuetify components, utility classes (`d-flex`, `ma-3`).
- Files: **kebab-case** (`table-item.vue`, `gathering-remove.post.ts`). Composables: `useCamelCase.ts`.
- Prefer Nuxt API suffixes (`.get.ts` / `.post.ts`) for new server routes.
- UI types: camelCase. API request bodies often snake_case (`gathering_id`, `guest_id`) — match existing endpoints.
- i18n: prefer `$t('key')` / `useI18n()`; many screens still hardcode Russian — do not mass-migrate without being asked.
- Translations: edit `i18n/locales/translations.csv` only (not generated JSON). Script strings that use `$t` must be `computed` so locale switches work.
- Scoped styles preferred; SCSS only where already used (e.g. schedule board).

## Naming

| Kind | Convention |
|------|------------|
| Pages / components | kebab-case Vue files |
| Composables | `useX.ts` |
| API routes | `/api/{db\|bgg\|tesera\|common\|auth}/resource` |
| Domain types | PascalCase in `shared/types/frontend.ts` |
| DB columns | snake_case (migrations) |

## Adding features

1. Read `CODE_MAP.md` + relevant `docs/features/*.md`.
2. Types first in `shared/types/frontend.ts`; schema changes in `server/db/schema` then `npm run db:generate` / `db:migrate`.
3. Server: add `server/api/...` handler using `#server/db`; transform via `server/transformers.ts` if mapping rows.
4. Client: page under `app/pages/`, reuse components; `$fetch` existing API style.
5. Permissions: check `profiles_club_rights` / composables (`useClubPermissions`, `useGetGlobalPermissions`); gate routes with `middleware: 'auth-required'` or admin middleware.
6. Update `CODE_MAP.md` and feature doc if the surface area changes.

## Modifying features

- Prefer smallest local change; match neighboring style.
- Keep transformers and frontend types in sync when fields change.
- Do not “fix” Telegram auth duplication or large gathering components unless asked.
- Preserve `useState('club')` ownership: written in club parent `[clubname].vue` / `useUpdateClubData`.

## API & data

- Client: `$fetch('/api/db/...')` or `useFetch` (rare). Auth via `authClient` / `useAuthUser`.
- Server domain: `db` from `#server/db` + `requireUser` when auth is required. Auth handler: `/api/auth/*` (`#server/utils/auth`).
- Errors: prefer `createError({ statusCode, statusMessage })`. External BGG/Tesera often return `{ items: [], error }` with HTTP 200 — preserve that pattern when extending those proxies.
- Schema: Drizzle (`server/db/schema`, `server/db/migrations`).

## Error handling

- Server domain APIs: `throw createError(...)`.
- Avoid new string throws (`throw 'up3'`) — legacy only in schedules.
- Client: existing pages often ignore typed errors; for new UI, surface failures to the user (snackbar/dialog) consistently with the page you edit.

## Testing

Vitest unit tests for the DB layer live under `tests/` (`npm test` / `npm run test:watch`). They cover transformers, schema shapes, auth→profile mapping, and migration SQL — no live Postgres required. Do not expand into a full e2e stack unless asked. Still manually verify risky changes with `npm run dev` / `npm run build`.

`npm run format:check` exists but the legacy tree is largely unformatted — do **not** run repo-wide `npm run format` unless asked.

## Commands

```bash
npm install
cp .env.dist .env   # fill values — see docs/env.md
npm run db:up       # local Postgres (Docker)
npm run db:migrate  # apply Drizzle migrations
npm run dev         # 0.0.0.0:80 (Telegram login needs this port)
npm run build
node .output/server/index.mjs
npm run preview
npm run db:generate # after schema edits
npm run db:studio
npm run format      # Prettier write
npm run format:check
```

App Docker image: `docker build . -t cartonis -f Dockerfile` then `docker run -p 80:80 --env-file .env -d cartonis`.

## Do NOT

- Invent schema fields or business rules not in `server/db/schema` / existing APIs.
- Add new domain schema under `supabase/migrations/` (legacy only).
- Query club domain tables directly from the browser when an API exists.
- Enable Telegram bots in `telegram-bots-starter` without explicit request.
- Commit `.env`, `creds.json`, or generated `i18n/locales/*.json` / `.generated/*`.
- Turn on `typescript.typeCheck` in nuxt.config without fixing known supabase/auth-js issues.
- Mass-refactor i18n, gathering UI, or TG auth duplication without approval.
- Add Pinia or a second CSS framework without approval.
- Push to remote or force-push unless asked.
