import { and, asc, desc, ilike } from 'drizzle-orm'
import { db } from '#server/db'
import { gameboxes } from '#server/db/schema'
import type { GameBoxWithClub } from '#shared/types/frontend.js'
import { gameBoxFromDb } from '#server/transformers.js'

export default defineEventHandler(async (event): Promise<{ items: GameBoxWithClub[] }> => {
  const query = getQuery(event) as {
    page: number
    itemsPerPage: number
    sortBy: { key: string; order: string }
    search: string
  }

  const pageSize = +query.itemsPerPage || 25
  const conditions = []
  if (query.search) {
    conditions.push(ilike(gameboxes.title, `%${query.search}%`))
  }

  let orderExpr = desc(gameboxes.id)
  if (query.sortBy?.key) {
    const col = (gameboxes as any)[query.sortBy.key] ?? gameboxes.id
    orderExpr = query.sortBy.order === 'ascending' ? asc(col) : desc(col)
  }

  const page = query.page ? +query.page - 1 : 0
  const offset = page * pageSize

  const data = await db
    .select()
    .from(gameboxes)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderExpr)
    .limit(pageSize)
    .offset(offset)

  return {
    items: data.map(gameBoxFromDb),
  }
})
