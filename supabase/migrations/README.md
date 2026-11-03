# Legacy Supabase SQL migrations

These files document the historical cloud Supabase schema (including `auth.*` / RLS).

**Domain schema source of truth is now Drizzle:**

- Tables/views: `server/db/schema/`
- SQL migrations: `server/db/migrations/`
- Apply: `npm run db:up` then `npm run db:migrate` (or `npm run db:push`)

Do not add new domain schema changes here.
