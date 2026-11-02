# Feature: Collection & add-games

## What it does

Browse a club’s game library with filters. Admins/staff add games via a multi-step wizard: paste titles → attach existing DB games → match Tesera/BGG → verify → insert into `gameboxes` and `clubs_collections`.

## Where it lives

| Layer | Paths |
|-------|-------|
| Browse | `app/pages/clubs/[clubname]/collection/index.vue` |
| Wizard | `app/pages/clubs/[clubname]/collection/add-games.vue` |
| Steps UI | `app/components/pages/add-games/*` |
| Cards | `app/components/gamebox-item.vue` |
| APIs | `club-collection.get`, `check-games-exists.post`, `check-games-in-club.post`, `gamebox-add.post`, `add-games-to-club.post`, plus `/api/tesera/*` and `/api/bgg/*` |
| Types | `GameBox`, `GameboxAddData`, `SyncTeseraBggMap`, `GamedataSource` |

## Data flow

1. List: `GET /api/supabase/club-collection?clubid&search&limit`.
2. Wizard step1: POST titles to `check-games-exists` / `check-games-in-club`.
3. Step2: select existing → `add-games-to-club`.
4. Step3: `GET /api/tesera/search`, `/api/bgg/search` (and get-gamebox) to pick variants.
5. Step4–5: merge → `POST /api/supabase/gamebox-add` → `add-games-to-club`.

BGG traffic is rate-limited by `server/plugins/bgg-timeout.ts`.

## Business rules

- Upsert gameboxes with `ignoreDuplicates` on `alias_tesera` (see `gamebox-add.post.ts`).
- Club membership is separate from global catalog (`clubs_collections`).
- Collection filter UI flags come from club settings (`collectionSearchRating` / duration / players).

## Extend safely

- New catalog fields: update `gameboxes` migration, `GameBox`, `gameBoxFromSupabase` / `gameBoxToSupabase`, admin + wizard columns (`gamebox-columns.ts`).
- Do not call BGG in a tight loop from the client — go through `/api/bgg` so the queue plugin applies.
- Stale helper `server/api/common/gamebox-check-exists.ts` proxies a wrong path; prefer `check-games-exists.post.ts` directly.
