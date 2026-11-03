# Feature: User schedules

## What it does

Logged-in users maintain named weekly availability calendars as boolean time segments, with history snapshots.

## Where it lives

| Layer | Paths |
|-------|-------|
| List | `app/pages/clubs/[clubname]/profile/schedules/list.vue` |
| Edit | `.../schedules/item/[[id]].vue` |
| Board UI | `app/components/pages/schedule/schedule-board.vue` |
| Stubs | `compare.vue`, `not-found.vue` |
| APIs | `schedule-list.ts`, `schedule-find.ts`, `schedule.post.ts` |
| Types | `Schedule`, `ScheduleHistoryItem` |
| Transform | `scheduleFromDb` |

## Data flow

- List: `GET /api/db/schedule-list` (session user).
- Load: `GET /api/db/schedule-find?scheduleId=`.
- Save: `POST /api/db/schedule` creates/updates schedule and inserts history segments.

## Notes for agents

- `schedule-find` / `schedule-list` use legacy string throws (`throw 'up3'` etc.) — prefer `createError` only when touching those files intentionally.
- `compare.vue` is an empty stub.
- Board uses SCSS + drag/toggle interactions; keep segment length contracts aligned with `ScheduleHistoryItem.segmentSize` / `segments`.
