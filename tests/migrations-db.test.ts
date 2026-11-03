import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

describe('Drizzle SQL migrations for new DB stack', () => {
  it('ships Better Auth migration creating user/session/account/verification', () => {
    const path = resolve(root, 'server/db/migrations/0001_better_auth.sql')
    expect(existsSync(path)).toBe(true)
    const sql = readFileSync(path, 'utf8')
    expect(sql).toContain('CREATE TABLE "user"')
    expect(sql).toContain('CREATE TABLE "session"')
    expect(sql).toContain('CREATE TABLE "account"')
    expect(sql).toContain('CREATE TABLE "verification"')
    expect(sql).toContain('telegram_id')
  })

  it('ships domain init migration with views replacing auth-dependent matviews', () => {
    const path = resolve(root, 'server/db/migrations/0000_init_domain.sql')
    expect(existsSync(path)).toBe(true)
    const sql = readFileSync(path, 'utf8')
    expect(sql).toContain('CREATE TABLE "profiles"')
    expect(sql).toContain('CREATE VIEW "public"."gameboxes_with_club_id"')
    expect(sql).toContain('CREATE VIEW "public"."gatherings_with_guests"')
    expect(sql).not.toContain('auth.users')
    expect(sql).not.toContain('auth.uid()')
  })

  it('records migrations in drizzle journal', () => {
    const journal = JSON.parse(
      readFileSync(resolve(root, 'server/db/migrations/meta/_journal.json'), 'utf8'),
    )
    const tags = journal.entries.map((e: { tag: string }) => e.tag)
    expect(tags).toContain('0000_init_domain')
    expect(tags).toContain('0001_better_auth')
    expect(tags).toContain('0002_chat_id_bigint_indexes')
  })

  it('ships chat_id bigint + hot-path indexes migration', () => {
    const path = resolve(root, 'server/db/migrations/0002_chat_id_bigint_indexes.sql')
    expect(existsSync(path)).toBe(true)
    const sql = readFileSync(path, 'utf8')
    expect(sql).toContain('ALTER COLUMN "chat_id" SET DATA TYPE bigint')
    expect(sql).toContain('clubs_url_name_uidx')
    expect(sql).toContain('gatherings_club_id_start_date_idx')
    expect(sql).toContain('user_telegram_id_idx')
  })
})

