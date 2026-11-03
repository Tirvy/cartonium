import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString =
  process.env.DATABASE_URL || 'postgresql://cartonium:cartonium@localhost:5432/cartonium'

// Nitro may evaluate this module more than once in dev; reuse the connection.
const globalForDb = globalThis as unknown as {
  __cartoniumSql?: ReturnType<typeof postgres>
  __cartoniumDb?: ReturnType<typeof drizzle<typeof schema>>
}

const sql =
  globalForDb.__cartoniumSql ??
  postgres(connectionString, {
    max: 10,
    prepare: false,
  })

export const db =
  globalForDb.__cartoniumDb ??
  drizzle(sql, { schema })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__cartoniumSql = sql
  globalForDb.__cartoniumDb = db
}

export type Db = typeof db
export { schema }
