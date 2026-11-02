# Feature: Global admin gameboxes

## What it does

Global admins manage the shared gamebox catalog (paginated CRUD) and bulk-fetch pictures into storage.

## Where it lives

| Layer | Paths |
|-------|-------|
| Hub | `app/pages/admin/index.vue` |
| CRUD | `app/pages/admin/gameboxes.vue` |
| Pictures | `app/pages/admin/gameboxes-pictures.vue` |
| Gate | `app/middleware/club-admin-reroute.global.ts` + `useGetGlobalPermissions` |
| APIs | `gameboxes.get.ts`, `gamebox-add.post.ts`, `gamebox-edit.post.ts`, `add-pictures.post.ts`, `my-global-permissions.ts` |

## Business rules

- `/admin*` requires logged-in user with global admin relation (middleware redirects otherwise).
- Also covered by supabase redirect include for `/admin(/*)?`.
- Pictures: POST `add-pictures` with `gameBoxIds` → fetch BGG thumbs → Storage `gamebox-pics`.

## Extend safely

- Keep admin table columns aligned with `GameBox` / `GameBoxWithClub`.
- Picture pipeline depends on BGG; respect rate-limit plugin behavior.
