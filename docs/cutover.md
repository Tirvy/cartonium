# Supabase → local Postgres cutover

## Fresh local install

```bash
cp .env.dist .env   # fill BETTER_AUTH_SECRET, bot token, etc.
npm install
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev
```

`db:seed` creates club `terra` and optional admin from `SEED_ADMIN_*` env vars.

## Importing existing Supabase data

1. Dump domain tables from Supabase (exclude `auth.*` / storage):

   ```bash
   pg_dump "$SUPABASE_DB_URL" \
     --schema=public \
     --data-only \
     --no-owner \
     -f supabase-public-data.sql
   ```

2. Start local Postgres and apply schema:

   ```bash
   npm run db:up
   npm run db:migrate
   ```

3. Restore data (resolve conflicts / sequence resets as needed):

   ```bash
   psql "$DATABASE_URL" -f supabase-public-data.sql
   ```

4. **Preserve Telegram identity** — backfill Better Auth rows with the same ids as `profiles.id`:

   ```bash
   npx tsx server/db/scripts/backfill-better-auth-from-profiles.ts
   ```

   Without this step, the first Telegram login creates a **new** Better Auth `user.id` and orphans gatherings, rights, and schedules.

5. Verify one known user: after Telegram login, `profiles.id` / session user id still match their historical gatherings `owner_id`.

6. Copy gamebox pictures into `GAMEBOX_PICS_DIR` (default `public/gamebox-pics/`) if you previously used Supabase Storage for them. Club avatars: set `clubs_settings.avatar_url` or place files under `public/club-avatars/{url_name}.png`.

## Auth / proxy notes

- Set `BETTER_AUTH_URL` and `NUXT_PUBLIC_SITE_URL` to the **exact** browser origin (including `https://` behind a reverse proxy).
- Add extra hosts to `BETTER_AUTH_TRUSTED_ORIGINS` (comma-separated).
- Email signup is disabled server-side unless `BETTER_AUTH_ALLOW_SIGNUP=true`.
