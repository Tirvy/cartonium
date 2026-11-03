# CODE_MAP — Cartonium / Cartonis

## PROJECT
NAME: cartonium (Cartonis) | ROLE: boardgame club site — gatherings, collections, schedules
STACK: Nuxt 4 + Vuetify + local Postgres/Drizzle + Better Auth + i18n(ru/en) + Nitro tasks + Telegram bots
AUTH: Telegram Login Widget / email via Better Auth; profiles in local Postgres
AI_DOCS: AGENTS.md | CODE_MAP.md | docs/ | .cursor/rules/*.mdc

## COMMANDS
DEV: npm run dev
DEV_NOTE: binds 0.0.0.0:80 (nuxt.config); README mentions :3000
DEV_HOST: npm run devhost
BUILD: npm run build
START_PROD: node .output/server/index.mjs
PREVIEW: npm run preview
DB_UP: npm run db:up
DB_MIGRATE: npm run db:migrate
DB_GENERATE: npm run db:generate
DB_PUSH: npm run db:push
DB_STUDIO: npm run db:studio
TYPES: npm run type
TYPES_LOCAL: npm run type-local
TYPES_SH: sh execs/supabase-type.sh
DOCKER_BUILD: docker build . -t cartonis -f Dockerfile
DOCKER_RUN: docker run -p 80:80 --env-file .env -d cartonis
DOCKER_LOCAL: sh execs/docker-builder.sh
TEST: none
FORMAT: npm run format
FORMAT_CHECK: npm run format:check

## CONFIG / ROOT
FILE: nuxt.config.ts | ROLE: Nuxt modules, i18n, supabase redirects, nitro tasks, port 80
FILE: vuetify.config.ts | ROLE: light/dark themes, VBtn defaults, locale ru
FILE: tsconfig.json | ROLE: extends .nuxt/tsconfig; verbatimModuleSyntax false
FILE: drizzle.config.ts | ROLE: Drizzle Kit config → server/db/migrations
FILE: docker-compose.yml | ROLE: local Postgres 16
FILE: Dockerfile | ROLE: node:20-alpine build + CMD .output/server/index.mjs
FILE: .env.dist | ROLE: env template (names only below)
FILE: .dockerignore | ROLE: docker ignore rules
FILE: package.json | ROLE: scripts + deps
FILE: README.md | ROLE: setup/run docs
FILE: i18n/locales/translations.csv | ROLE: nuxt-translation-manager source strings
FILE: public/privacy-policy.html | ROLE: static privacy page
FILE: execs/supabase-type.sh | ROLE: optional remote Auth-era types → .generated/
FILE: execs/docker-builder.sh | ROLE: docker build with .env as build-args
ENV_KEYS: DATABASE_URL, POSTGRES_*, BETTER_AUTH_SECRET, BETTER_AUTH_URL, NUXT_PUBLIC_SITE_URL, NUXT_BOT_TOKEN, NUXT_PUBLIC_BOT_LOGIN, NUXT_BOT_BLOODBOWL_TOKEN, NUXT_BOT_BLOODBOWL_SPREADSHEET, NUXT_BOT_BLOODBOWL_LEAGUE, NUXT_BOT_SCHEDULE_TOKEN
DOCKER_ARGS_EXTRA: NUXT_BOT_LOGER_TOKEN, NUXT_BOT_LUBA_TOKEN, NUXT_BOT_LUBA_SPREADSHEET, GOOGLE_CREDS_URL, NITRO_PORT, PORT

## SHARED TYPES
FILE: shared/types/frontend.ts | ROLE: UI/domain camelCase types
FILE: shared/types/supabase.ts | ROLE: legacy MergeDeep override of generated Auth-era DB types (domain queries use Drizzle)
FILE: shared/types/index.d.ts | ROLE: Nitro $Fetch typed-response override
FILE: shared/types/visit.d.ts | ROLE: Visit type (unused by app)

## SERVER DB (Drizzle)
FILE: server/db/index.ts | ROLE: postgres.js + drizzle singleton
FILE: server/db/schema/index.ts | ROLE: domain tables + views (snake_case fields)
FILE: server/db/migrations/ | ROLE: SQL migrations from drizzle-kit
FILE: server/utils/auth.ts | ROLE: Better Auth instance (Drizzle + Telegram plugin)
FILE: server/api/auth/[...all].ts | ROLE: Better Auth HTTP handler
FILE: server/utils/require-user.ts | ROLE: require Better Auth session for domain writes
FILE: server/utils/upsert-profile.ts | ROLE: auth user → local profiles upsert
FILE: app/utils/auth-client.ts | ROLE: Better Auth client + telegramClient
FILE: app/composables/useAuthUser.ts | ROLE: reactive session user for UI
NOTE: /api/db/* handlers use Drizzle (#server/db); auth is Better Auth


TYPE: GameBox { id, aliasTesera, idBgg, idTesera, linkBgg, linkTesera, photoUrl, playersGood, playersMax, playersMin, playtimeAvg, playtimeMax, playtimeMin, ratingBgg, ratingTesera, title, titles, year }
TYPE: GameBoxWithClub extends GameBox { clubId }
TYPE: GameBoxSearchResult { id?, title?, year?, alias?, titles?, photoUrl? }
TYPE: GameboxAddData { name, preciseSearch?, foundGamebox, indaclub, gameTeseraVariants, gameBggVariants, gameTesera, gameBgg }
TYPE: SyncTeseraBggItem { selected, gameTesera, gameBgg }
TYPE: SyncTeseraBggMap { [key]: SyncTeseraBggItem }
TYPE: GamedataSource = "tesera" | "bgg"
TYPE: GameBoxDataBgg { title, idBgg, playersMin/Max/Good, playtimeMin/Max/Avg, ratingBgg, weightBgg, year, linkBgg }
TYPE: GameBoxDataTesera { idBgg, idTesera, title, aliasTesera, photoUrl, year, ratingTesera, ratingBgg, playersMin/Max, linkTesera }
TYPE: Club { id, title, urlName, themes, avatarUrl, guestCanGatherOwn, guestCanReserve, gatheringWarning, reservationLinks, reservationPhones, collectionSearchRating, collectionSearchDuration, collectionSearchPlayers }
TYPE: ClubCollection { clubId, gameBoxId, id }
TYPE: ClubInfo { clubId, textHtml }
TYPE: Gathering { id, clubId, ownerId, gameboxId, tableId, startDate, guestsMax, commentClub, commentOwner, ownName }
TYPE: GatheringGuest { id, title, messageUrl, imageUrl, totalGuests, telegramLink, telegramUsername }
TYPE: GatheringWithGuests extends Gathering { guests, gamebox, ownTitle, slotsFilled, ownerUser }
TYPE: GatheringsWithDates { type, date, dateObj, gathering? }
TYPE: GatheringComputedValue { canJoin, canLeave, canAddGuests, hasMyGuests, myGuests, slotsAvailable }
TYPE: Table { id?, clubId, title, description, peopleMax }
TYPE: TelegramNotification { to, type, why, what, bot_name }
TYPE: Schedule { id, title, visibility, history }
TYPE: ScheduleHistoryItem { id, created, segmentSize, segments }
TYPE: Loaders { [key]: boolean }
TYPE: Visit { visiterId, start, end, checkType, checkSum }

## APP — ROOT / LAYOUTS / MIDDLEWARE / PLUGINS / UTILS
FILE: app/app.vue | ROLE: root shell — loading + NuxtLayout + NuxtPage
FILE: app/layouts/default.vue | ROLE: global bar (brand, i18n, TG login)
FILE: app/layouts/login.vue | ROLE: empty v-app for auth callback
FILE: app/layouts/in-da-club.vue | ROLE: club chrome — nav, user, cookie, theme
FILE: app/middleware/club-admin-reroute.global.ts | ROLE: /admin* requires global admin
FN: defineNuxtRouteMiddleware(to, from) | ....
FILE: app/middleware/set-session.global.ts | ROLE: consume telegram_*_token query → Supabase session
FN: defineNuxtRouteMiddleware(to, from) | ....
FILE: app/plugins/maska.ts | ROLE: registers v-maska
FILE: app/utils/helpers.ts | ROLE: id-hash + JSON guard
FN: listToHashed(sortSource) | ....
FN: isJson(element) | ....
FILE: app/utils/rules.ts | ROLE: Vuetify form rules
FN: ruleIsNumber(value) | ....
FN: ruleIsNotNegative(value) | ....
FN: ruleIsTime(value) | ....
FILE: app/utils/gamebox-picture-get.ts | ROLE: storage URL else Tesera photoUrl
FN: gameboxPictureGet(gamebox) | ....

## APP — COMPOSABLES
FILE: app/composables/useClubPermissions.ts | ROLE: user↔current-club relation
FN: useClubPermissions() → { clubPermissions, update }
FILE: app/composables/useConstants.ts | ROLE: named constant bags (GameBox columns)
FN: useConstants(key) → any
FILE: app/composables/useCurrentUserAsGuest.ts | ROLE: Supabase user → GatheringGuest
FN: useCurrentUserAsGuest() → GatheringGuest
FILE: app/composables/useDebounce.ts | ROLE: debounce wrapper
FN: useDebounce(func, timeout) → (...args) => void
FILE: app/composables/useDefaultPage.ts | ROLE: post-login route → club terra gatherings
FN: useDefaultPage() → route
FILE: app/composables/useGetGlobalPermissions.ts | ROLE: any global admin relation?
FN: useGetGlobalPermissions() → Promise<boolean>
FILE: app/composables/useUpdateClubData.ts | ROLE: fetch Club by urlName
FN: useUpdateClubData() → (clubname) => Club | null

## APP — PAGES
FILE: app/pages/index.vue | ROLE: / landing; logged-in → default club gatherings
FILE: app/pages/confirm.vue | ROLE: /confirm Supabase auth callback
FILE: app/pages/admin/index.vue | ROLE: /admin global-admin hub
FILE: app/pages/admin/gameboxes.vue | ROLE: /admin/gameboxes paginated gamebox CRUD
FN: loadItems({ page, itemsPerPage, sortBy, search }) | ....
FN: saveEdit() / updateGamebox(gamebox) / addGamebox(gamebox) | ....
FILE: app/pages/admin/gameboxes-pictures.vue | ROLE: /admin/gameboxes-pictures bulk picture fetch
FN: getNewPictures() | ....
FILE: app/pages/users/index.vue | ROLE: /users BGG/Tesera user collection debug
FILE: app/pages/dev/ui-kit.vue | ROLE: /dev/ui-kit Vuetify playground
FILE: app/pages/auth/telegram-callback-page.vue | ROLE: /auth/telegram-callback-page posts TG payload → navigate
FILE: app/pages/clubs/[clubname].vue | ROLE: /clubs/:clubname parent load/SEO; → gatherings
FILE: app/pages/clubs/[clubname]/admin-login.vue | ROLE: club login/logout
FILE: app/pages/clubs/[clubname]/gatherings.vue | ROLE: guests→/table, admins→/table-admin
FILE: app/pages/clubs/[clubname]/gatherings/item[[id]].vue | ROLE: create/edit gathering form
FN: saveGathering() | ....
FILE: app/pages/clubs/[clubname]/gatherings/gathering-accepted.vue | ROLE: post-create summary + share link
FILE: app/pages/clubs/[clubname]/gatherings/table.vue | ROLE: guest gatherings parent (join/leave/dialogs) → /list
FN: guestSet(gatheringId, number) / guestsApply() / gatheringRemove(...) | ....
FILE: app/pages/clubs/[clubname]/gatherings/table-admin.vue | ROLE: admin date-filtered gatherings table
FN: updateFilters() / editGathering(gathering) | ....
FILE: app/pages/clubs/[clubname]/gatherings/table/list.vue | ROLE: guest gathering cards + view pref
FILE: app/pages/clubs/[clubname]/gatherings/table/[id].vue | ROLE: single gathering card + OG meta
FILE: app/pages/clubs/[clubname]/gatherings/not-found.vue | ROLE: gathering 404
FILE: app/pages/clubs/[clubname]/settings.vue | ROLE: settings parent; non-admins bounced
FILE: app/pages/clubs/[clubname]/settings/index.vue | ROLE: club flags (reservation, guests, filters)
FN: saveChanges() | ....
FILE: app/pages/clubs/[clubname]/settings/tables.vue | ROLE: CRUD physical club tables
FN: getTables() / saveTable() / editTable(table) | ....
FILE: app/pages/clubs/[clubname]/settings/themes.vue | ROLE: live color theme editor (save incomplete)
FILE: app/pages/clubs/[clubname]/information/public.vue | ROLE: public club HTML info
FILE: app/pages/clubs/[clubname]/information/edit.vue | ROLE: Quill editor for club info
FN: saveToDatabase() | ....
FILE: app/pages/clubs/[clubname]/collection/index.vue | ROLE: filterable club gamebox library
FN: applyFilter() / fetchData() | ....
FILE: app/pages/clubs/[clubname]/collection/add-games.vue | ROLE: 5-step add-games wizard
FN: saveGamesList(value) / addTheseExisting(...) / searchForeignData(source, titles) / getGameBoxData(syncData) / sendGameboxesToSupabase(gameboxesData) | ....
FILE: app/pages/clubs/[clubname]/profile/index.vue | ROLE: profile — theme toggle, logout, login
FILE: app/pages/clubs/[clubname]/profile/schedules/list.vue | ROLE: user’s availability schedules
FILE: app/pages/clubs/[clubname]/profile/schedules/item/[[id]].vue | ROLE: create/edit weekly availability board
FN: saveSchedule() / changeSchedule(value) | ....
FILE: app/pages/clubs/[clubname]/profile/schedules/compare.vue | ROLE: stub
FILE: app/pages/clubs/[clubname]/profile/schedules/not-found.vue | ROLE: schedule 404

## APP — COMPONENTS
FILE: app/components/fast-action.vue | ROLE: FAB slot wrapper
FILE: app/components/gamebox-adder.vue | ROLE: gamebox list (add emit unused)
FILE: app/components/gamebox-item.vue | ROLE: club-collection card
FILE: app/components/library-item.vue | ROLE: user-collection card w/ chips
FILE: app/components/user-avatar.vue | ROLE: avatar from GatheringGuest
FILE: app/components/date-text-picker.vue | ROLE: text-field date picker v-model
FILE: app/components/common/login.vue | ROLE: email/password login card
FN: signInWithEmail() / signUpNewUser() / authByTelegram(user) | ....
FILE: app/components/common/telegramLoginButton.vue | ROLE: injects TG Login Widget script
FILE: app/components/common/week-indicator.vue | ROLE: week strip highlighting target day
FILE: app/components/pages/cookie/asker.client.vue | ROLE: cookie-consent banner (client-only)
FILE: app/components/pages/gatherings/table-item.vue | ROLE: gathering card (minimal/compact/full)
FILE: app/components/pages/gatherings/table-item-skeleton.vue | ROLE: gathering card skeleton
FILE: app/components/pages/schedule/schedule-board.vue | ROLE: week×hour availability grid drag-toggle
FN: invertSegment(dayIndex, timeIndex) / updateSegments() | ....
FILE: app/components/pages/add-games/list.vue | ROLE: step1 paste titles, check existence
FILE: app/components/pages/add-games/add-existing.vue | ROLE: step2 select existing DB games for club
FILE: app/components/pages/add-games/add-gameboxes.vue | ROLE: step3 pick Tesera/BGG variants
FILE: app/components/pages/add-games/table-item.vue | ROLE: Tesera/BGG variant selector cell
FILE: app/components/pages/add-games/data-verify.vue | ROLE: step4 preview GameBox rows before insert
FILE: app/components/pages/add-games/ending.vue | ROLE: step5 done → collection
FILE: app/components/pages/add-games/gamebox-columns.ts | ROLE: GameBox field names for headers
FILE: app/components/pages/add-games/data.js | ROLE: sample multiline game titles

## SERVER — TRANSFORMERS / UTILS / PLUGINS / TASKS / ROUTES
FILE: server/transformers.ts | ROLE: snake_case DB rows ↔ camelCase frontend
FN: clubFromDb(data, clubSettingsData) → Club | ....
FN: clubCollectionFromDb(data) → ClubCollection | ....
FN: clubInfoFromDb(data) → ClubInfo | ....
FN: gameBoxFromDb(data) → GameBoxWithClub | ....
FN: gameBoxToDb(gameBox) → Tables<'gameboxes'> | ....
FN: gatheringFromDb(data) → Gathering | ....
FN: gatheringWithGuestsFromDb(data) → GatheringWithGuests | ....
FN: tablesFromDb(data) → Table | ....
FN: scheduleFromDb(data) → Schedule | ....
FILE: server/utils/check-telegram-auth.ts | ROLE: HMAC-verify TG Login Widget payload
FN: default(tgData: TelegramLoginPayload) → boolean | ....
FILE: server/utils/telegram-password-generator.ts | ROLE: deterministic HMAC password from TG id
FN: default(tgData: TelegramLoginPayload) → string | ....
FILE: server/utils/telegram-bots.ts | ROLE: shared botPublic + botLogger instances
FILE: server/utils/send-telegram-message.ts | ROLE: send via botPublic MarkdownV2
FN: sendTelegramMessage(message) | ....
FILE: server/utils/telegram-notify.ts | ROLE: notify wrapper (queue store commented)
FN: telegramNotify(event, message) | ....
FILE: server/utils/store-message.ts | ROLE: enqueue to pgmq telegram-messages
FN: storeMessage(event, message) | ....
FILE: server/utils/profile-club-rights.ts | ROLE: session user’s club_id list
FN: profileClubRights(event) | ....
FILE: server/plugins/bgg-timeout.ts | ROLE: serialize /api/bgg/* 2.5s gap; 429 → 5min cooldown
FILE: server/plugins/telegram-bots-starter.ts | ROLE: bot launcher — club-schedule when token set
FILE: server/tasks/telegram/send-messages.ts | ROLE: Nitro task drain pgmq → send TG
TASK: telegram:send-messages | ROLE: rpc read queue, send, archive
FILE: server/routes/auth/telegram-callback.ts | ROLE: TG signup/signin then sendRedirect w/ tokens
ENDPOINT: GET /auth/telegram-callback | ROLE: verify TG → session redirect

## SERVER — API CATCH-ALL / BGG / TESERA / COMMON
FILE: server/api/[...].ts | ROLE: unmatched /api/* stub
ENDPOINT: ANY /api/** | ROLE: returns "Hello Nitro"
FILE: server/api/bgg/common.ts | ROLE: BGG xmlapi2 base URL
FILE: server/api/bgg/get-game.ts | ROLE: exact BGG search
ENDPOINT: GET /api/bgg/get-game?query= | ROLE: BGG /search exact=1
FILE: server/api/bgg/get-gamebox.ts | ROLE: BGG thing → GameBoxDataBgg
ENDPOINT: GET /api/bgg/get-gamebox?id= | ROLE: BGG /thing + stats
FILE: server/api/bgg/get-user-collection.ts | ROLE: BGG user collection (retry on 202)
ENDPOINT: GET /api/bgg/get-user-collection?username= | ROLE: BGG /collection
FILE: server/api/bgg/search.ts | ROLE: fuzzy BGG title search
ENDPOINT: GET /api/bgg/search?titles= | ROLE: multi-title search → {items}
FILE: server/api/tesera/common.ts | ROLE: Tesera API URL + collectionParser
FN: collectionParser(collection) | ....
FILE: server/api/tesera/get-gamebox.ts | ROLE: Tesera game by alias
ENDPOINT: GET /api/tesera/get-gamebox?alias= | ROLE: → GameBoxDataTesera
FILE: server/api/tesera/get-user-collection.ts | ROLE: Tesera user games
ENDPOINT: GET /api/tesera/get-user-collection?username= | ROLE: user collection
FILE: server/api/tesera/search.ts | ROLE: Tesera title search
ENDPOINT: GET /api/tesera/search?title= | ROLE: → {items} GameBoxSearchResult
FILE: server/api/common/telegram-callback.ts | ROLE: TG widget → Supabase signup/signin JSON
ENDPOINT: GET /api/common/telegram-callback | ROLE: verify → {url} w/ tokens
FILE: server/api/common/try-login.ts | ROLE: TG-verified signIn only
ENDPOINT: GET /api/common/try-login | ROLE: signInWithPassword → {url}
FILE: server/api/common/try-register.ts | ROLE: TG-verified signUp only
ENDPOINT: GET /api/common/try-register | ROLE: auth.signUp → {url}
FILE: server/api/common/get-creds.ts | ROLE: synthetic TG login/password
ENDPOINT: GET /api/common/get-creds | ROLE: {login, password}
FILE: server/api/common/add-pictures.post.ts | ROLE: BGG thumbs → storage gamebox-pics
ENDPOINT: POST /api/common/add-pictures | ROLE: body.gameBoxIds → upload
FILE: server/api/common/gamebox-check-exists.ts | ROLE: proxy existence check (stale path)
ENDPOINT: GET /api/common/gamebox-check-exists?alias= | ROLE: proxies check-game-exists

## SERVER — API SUPABASE
FILE: server/api/db/club-data.get.ts | ROLE: club by url_name + settings
ENDPOINT: GET /api/db/club-data?clubname= | ROLE: → Club
FILE: server/api/db/club-info.get.ts | ROLE: club HTML info
ENDPOINT: GET /api/db/club-info?clubid= | ROLE: clubs_info row
FILE: server/api/db/club-info.post.ts | ROLE: upsert club HTML
ENDPOINT: POST /api/db/club-info | ROLE: {club_id, text_html}
FILE: server/api/db/club-settings.post.ts | ROLE: upsert club settings
ENDPOINT: POST /api/db/club-settings | ROLE: upsert clubs_settings
FILE: server/api/db/club-collection.get.ts | ROLE: club gameboxes search
ENDPOINT: GET /api/db/club-collection?clubid=&search=&limit= | ROLE: → GameBox[]
FILE: server/api/db/club-tables.get.ts | ROLE: club tables
ENDPOINT: GET /api/db/club-tables?clubid= | ROLE: → Table[]
FILE: server/api/db/club-tables.post.ts | ROLE: upsert tables
ENDPOINT: POST /api/db/club-tables | ROLE: upsert on id
FILE: server/api/db/add-games-to-club.post.ts | ROLE: add boxes to club collection
ENDPOINT: POST /api/db/add-games-to-club?clubid= | ROLE: body.gameBoxIds
FILE: server/api/db/check-games-in-club.post.ts | ROLE: which ids already in club
ENDPOINT: POST /api/db/check-games-in-club?clubid= | ROLE: body.ids → present ids
FILE: server/api/db/check-games-exists.post.ts | ROLE: find gameboxes by title overlap
ENDPOINT: POST /api/db/check-games-exists | ROLE: body.titles[] → GameBox[]
FILE: server/api/db/gameboxes.get.ts | ROLE: paginated global catalog
ENDPOINT: GET /api/db/gameboxes?... | ROLE: {items: GameBoxWithClub[]}
FILE: server/api/db/gamebox-add.post.ts | ROLE: upsert new gameboxes
ENDPOINT: POST /api/db/gamebox-add | ROLE: body GameBox[] ignoreDuplicates alias_tesera
FILE: server/api/db/gamebox-edit.post.ts | ROLE: update one gamebox
ENDPOINT: POST /api/db/gamebox-edit | ROLE: body.gamebox by id
FILE: server/api/db/my-global-permissions.ts | ROLE: current user club rights
ENDPOINT: GET /api/db/my-global-permissions | ROLE: profiles_club_rights for session
FILE: server/api/db/my-clubs-permissions.ts | ROLE: rights for user+club
ENDPOINT: GET /api/db/my-clubs-permissions?userid=&clubid= | ROLE: filtered rights
FILE: server/api/db/gatherings.get.ts | ROLE: upcoming gatherings w/ guests
ENDPOINT: GET /api/db/gatherings?clubid=&date-from= | ROLE: merged by id
FN: clampGatherings(gatheringsArray) | ....
FILE: server/api/db/gathering-find.get.ts | ROLE: one gathering
ENDPOINT: GET /api/db/gathering-find?clubid=&gatheringid= | ROLE: → Gathering
FILE: server/api/db/gathering.post.ts | ROLE: create/update gathering + host guest
ENDPOINT: POST /api/db/gathering | ROLE: upsert gatherings + host guest
FILE: server/api/db/gathering-remove.post.ts | ROLE: delete gathering + notify
ENDPOINT: POST /api/db/gathering-remove | ROLE: delete + TG cancel msgs
FILE: server/api/db/gatherings-set-guest.ts | ROLE: upsert guest count + notify
ENDPOINT: POST /api/db/gatherings-set-guest | ROLE: {gathering_id, guest_id, number}
FILE: server/api/db/schedule-list.ts | ROLE: user’s schedules
ENDPOINT: GET /api/db/schedule-list | ROLE: → Schedule[]
FILE: server/api/db/schedule-find.ts | ROLE: one schedule + history
ENDPOINT: GET /api/db/schedule-find?scheduleId= | ROLE: → Schedule
FILE: server/api/db/schedule.post.ts | ROLE: create/rename schedule + history
ENDPOINT: POST /api/db/schedule | ROLE: insert/update + history segments → id

## TELEGRAM BOTS
NOTE: telegram-bots-starter starts club-schedule when NUXT_BOT_SCHEDULE_TOKEN is set; other bots remain commented out
TOKENS: NUXT_BOT_SCHEDULE_TOKEN, NUXT_BOT_BLOODBOWL_TOKEN, NUXT_BOT_LUBA_TOKEN, NUXT_BOT_FLOODREADER_TOKEN

### club-schedule — club gatherings list
FILE: server/telegram-bots/club-schedule/bot-object.ts | ROLE: TelegramBot instance
FILE: server/telegram-bots/club-schedule/club-schedule.ts | ROLE: polling + /start + /schedule
CMDS: /start {club_id}, /schedule
FILE: server/telegram-bots/club-schedule/supabase.ts | ROLE: service-role Supabase client
FILE: server/telegram-bots/club-schedule/bindings.ts | ROLE: chat→club binding CRUD
FN: getClubBinding(chatId) / setClubBinding(chatId, clubId) / isClubId(value) | ....
FILE: server/telegram-bots/club-schedule/gatherings.ts | ROLE: fetch + format upcoming gatherings
FN: fetchUpcomingGatherings(clubId) / formatGatheringsMessage(...) / findProfileIdByTelegramChatId(...) | ....
FILE: server/telegram-bots/club-schedule/types.ts | ROLE: BOT_NAME, ClubBinding
TABLE: telegram_bot_club_bindings | ROLE: (chat_id, bot_name) → club_id

### blood-bowl-tbilisi — league match-prediction (Tourplay + Google Sheet)
FILE: server/telegram-bots/blood-bowl-tbilisi/README.md | ROLE: RU docs
FILE: server/telegram-bots/blood-bowl-tbilisi/blood-bowl-predicter.ts | ROLE: TelegramBot instance export
FILE: server/telegram-bots/blood-bowl-tbilisi/blood-bowl.ts | ROLE: polling + cmds + vote callbacks
CMDS: /get_link, /gimme_votes_again, /update_fixtures, /start_votes
FILE: server/telegram-bots/blood-bowl-tbilisi/storage.ts | ROLE: Nitro storage BloodBowlTbilisiLeague
FILE: server/telegram-bots/blood-bowl-tbilisi/common.ts | ROLE: chats/votes cache vs Google
FN: getTelegramChatsFromStore() / getVotes() / setVotesToStore(votesData) / addNewChatData(newValue) | ....
FILE: server/telegram-bots/blood-bowl-tbilisi/handle-new-chat.ts | ROLE: onboard coach name → sheet match → votes
FN: handleNewChat(message) | ....
FILE: server/telegram-bots/blood-bowl-tbilisi/votes-and-buttons.ts | ROLE: week fixtures msgs + inline keyboards
FN: sendVotesToEveryone() / sendVotesTo(chatId, weekNumber) / updateMessageButtons(query, matchId) | ....
FILE: server/telegram-bots/blood-bowl-tbilisi/api-tourplay.ts | ROLE: Tourplay fixtures cache
FN: getCurrentWeekNumber() / updateFixtures() / getCurrentFixtures(weekNumber?) / getLeagueLink() | ....
FILE: server/telegram-bots/blood-bowl-tbilisi/api-google-sheets.ts | ROLE: Sheets fixtures/chats/predictions
FN: saveFixtures(competition) / fetchChatsToStore() / uploadNewTelegramChat(data) / saveVoteToGoogle(vote) / getGoogleVotes() | ....
FILE: server/telegram-bots/blood-bowl-tbilisi/error.ts | ROLE: error msg to chat
FN: sendBloodBowlError(chatId, message) | ....
FILE: server/telegram-bots/blood-bowl-tbilisi/types.ts | ROLE: MatchBloodBowl, CompetitionBloodBowl, TeamBloodBowl, BloodBowlVote, HashedVotes, …

### luba-bot — English quiz from Google Sheet
FILE: server/telegram-bots/luba-bot/bot-object.ts | ROLE: TelegramBot instance
FILE: server/telegram-bots/luba-bot/luba-bot.ts | ROLE: polling quiz runner
CMDS: /start, /update_questions, /get_tests_names, /start_test {name}
FILE: server/telegram-bots/luba-bot/storage.ts | ROLE: Nitro storage LubaEnglish
FILE: server/telegram-bots/luba-bot/common.ts | ROLE: questions cache + persist answers
FN: getQuestionsHashed() / saveAnswer(answer) | ....
FILE: server/telegram-bots/luba-bot/api-google-sheets.ts | ROLE: load QuestionsList, append answers
FN: fetchQuestionsToLocalStore() / saveAnswerToGoogle(answer) | ....
FILE: server/telegram-bots/luba-bot/error.ts | ROLE: silent error to support chat
FN: sendBotError(message, chatId?) | ....
FILE: server/telegram-bots/luba-bot/types.ts | ROLE: Question, Answer, StoredState, QuestionsHashed

### flood-reader — TTS experiment stub
FILE: server/telegram-bots/flood-reader/bot-object.ts | ROLE: TelegramBot instance
FILE: server/telegram-bots/flood-reader/flood-reader.ts | ROLE: starts polling; TTS handlers commented
FN: quickStart() | ....

## DB
FILE: supabase/migrations/README.md | ROLE: legacy cloud schema — do not extend; use server/db
FILE: supabase/migrations/20260325073214_init.sql | ROLE: LEGACY cloud dump (reference only)
FILE: supabase/migrations/20260328234215_profile_sync.sql | ROLE: LEGACY auth.users sync (not used locally)
FILE: supabase/migrations/20261102150000_telegram_bot_club_bindings.sql | ROLE: LEGACY bot bindings SQL (ported to Drizzle)
TABLE: gameboxes | ROLE: board-game catalog (Tesera/BGG ids, ratings, players, playtime)
TABLE: clubs | ROLE: club identity (title, url_name)
TABLE: clubs_collections | ROLE: club ↔ gamebox membership
TABLE: clubs_info | ROLE: club about-page HTML
TABLE: clubs_settings | ROLE: themes, avatar, guest perms, filters, reservation contacts
TABLE: gatherings | ROLE: play sessions (owner, club, table, gamebox, guest cap)
TABLE: gatherings_guests | ROLE: RSVP + guest count
TABLE: profiles | ROLE: public user profile (telegram, bot, chat_id)
TABLE: profiles_club_rights | ROLE: user–club role (relation_type)
TABLE: tables | ROLE: physical tables at a club
TABLE: telegram_chats | ROLE: user↔bot chat mapping
TABLE: telegram_chats_logs | ROLE: bot/admin chat log mapping
TABLE: telegram_bot_club_bindings | ROLE: side-bot chat→club context (service role)
TABLE: user_schedules | ROLE: named availability calendars
TABLE: user_schedules_history | ROLE: time-segment availability snapshots
TABLE: profile | ROLE: auth-synced profile (email, full_name, avatar_url, terms_accepted_at)
VIEW: gameboxes_with_club_id | ROLE: gameboxes + owning club ids array
VIEW: users_raw_data | ROLE: auth.users id + metadata
VIEW: gatherings_with_guests | ROLE: upcoming gatherings joined guests/profiles/gamebox/owner

## DOMAIN FLOW
FLOW: / → login (TG/email) → set-session tokens → default club (terra)
FLOW: /clubs/:name → club-data → layout in-da-club
FLOW: gatherings → gatherings.get → join/leave via gatherings-set-guest → TG notify
FLOW: gathering create/edit → gathering.post; remove → gathering-remove + TG cancel
FLOW: collection → club-collection; add-games wizard → Tesera/BGG search → gamebox-add → add-games-to-club
FLOW: settings/tables → club-settings / club-tables; info → club-info
FLOW: schedules → schedule-list/find/post + schedule-board segments
FLOW: admin → my-global-permissions gate → gameboxes CRUD / pictures
