# AI maintainability notes (Phase 4)

No large refactors were applied. Prioritized recommendations for future approved work.

## P0 — High impact / confusion risk

| Issue | Refs | Benefit |
|-------|------|---------|
| Telegram auth duplicated 4–5 ways | `server/api/common/telegram-callback.ts`, `try-login.ts`, `try-register.ts`, `server/routes/auth/telegram-callback.ts`, `get-creds.ts` | Single verify/sign-in helper reduces drift and security mistakes |
| Gathering card mega-component | `app/components/pages/gatherings/table-item.vue` (~430+ lines, 5 near-copy templates) | Safer UI changes; less merge pain |
| Soft vs hard API errors | BGG/Tesera return `{error}` HTTP 200; supabase uses `createError`; schedules `throw 'upN'` | Predictable client error handling |
| Stale existence proxy | `server/api/common/gamebox-check-exists.ts` → wrong path vs `check-games-exists.post.ts` | Avoid broken callers |

## P1 — Type safety & contracts

| Issue | Refs | Benefit |
|-------|------|---------|
| `typescript.typeCheck: false` | `nuxt.config.ts` | Catch regressions once supabase/auth-js override issue fixed |
| Untyped `$fetch` / `any` | pages + `transformers.ts`, `bgg/get-gamebox.ts` | Safer refactors |
| Mixed import suffixes | `~/types/frontend` vs `.js` vs `#shared` | Consistent resolution for agents |
| `useConstants` / `useDebounce` weakly typed | `app/composables/*` | Clear contracts |

## P2 — Structure & consistency

| Issue | Refs | Benefit |
|-------|------|---------|
| API file naming inconsistent | some `.get.ts`/`.post.ts`, some bare (`schedule-list.ts`, `gatherings-set-guest.ts`) | Clearer Nitro method routing |
| Guest list logic duplicated | `table.vue` vs `table-admin.vue` | One fetch/join pipeline |
| Google Sheets client copied | luba vs blood-bowl `api-google-sheets.ts` | Shared auth helper for bots |
| Hardcoded Russian vs `$t` | many gathering/settings forms | Real i18n coverage |
| Dead/stub UI | `schedules/compare.vue`, empty `gamebox-adder` add, `login.vue` TG stub | Less false leads for agents |
| Commented XML dump in BGG parser | `server/api/bgg/get-gamebox.ts` (~500 lines) | Faster navigation |

## P3 — Tooling (optional)

| Issue | Notes |
|-------|-------|
| No ESLint | Prettier-only today; add `@nuxt/eslint` only with team buy-in |
| No tests | Start with API contract tests for transformers + gatherings-set-guest if suite is desired |
| Prettier not applied repo-wide | `npm run format:check` reports many pre-existing style diffs; do not mass-format unless approved |
| `public/privacy-policy.html` | Malformed closing `</p>` — ignored by Prettier; fix HTML separately |
| README port | Corrected to :80 in README; matches `nuxt.config.ts` |

## Safe micro-improvements (need approval per item)

1. Delete or fix `gamebox-check-exists.ts` path.
2. Replace schedule `throw 'upN'` with `createError` when editing those files.
3. Add `$fetch<Type>` on new/changed client calls only.
4. Trim obsolete commented blocks in `bgg/get-gamebox.ts` when touching BGG.
5. Point README dev URL to port 80.
