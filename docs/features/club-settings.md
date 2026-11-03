# Feature: Club settings, tables, info, themes

## What it does

Club staff configure guest permissions, reservation contacts, collection filter toggles, physical tables, public HTML information, and (partially) color themes.

## Where it lives

| Area | Pages | APIs |
|------|-------|------|
| Flags | `.../settings/index.vue` | `club-settings.post.ts`, data via `club-data.get.ts` |
| Tables | `.../settings/tables.vue` | `club-tables.get.ts`, `club-tables.post.ts` |
| Themes | `.../settings/themes.vue` | live editor; save UI incomplete |
| Public info | `.../information/public.vue` | `club-info.get.ts` |
| Edit info | `.../information/edit.vue` (Quill) | `club-info.post.ts` |
| Parent gate | `.../settings.vue` | non-admins bounced to gatherings |

Types: `Club`, `Table`, `ClubInfo`. Transformers: `clubFromDb`, `tablesFromDb`, `clubInfoFromDb`.

## Business rules

- Settings parent redirects users without admin rights to gatherings.
- Supabase auth redirect **includes** settings and information edit paths.
- Club object in UI merges `clubs` + `clubs_settings` fields.

## Extend safely

- New setting flag: DB `clubs_settings` column → `clubFromDb` / `Club` type → settings form → POST body field names as existing handler expects.
- Themes save is incomplete — confirm intended persistence before wiring a new API.
