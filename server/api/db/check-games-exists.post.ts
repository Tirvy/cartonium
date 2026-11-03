import { arrayOverlaps } from 'drizzle-orm'
import { db } from '#server/db'
import { gameboxes } from '#server/db/schema'
import { gameBoxFromDb } from '#server/transformers'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  let titles = body.titles as string[]
  if (!titles?.length) {
    throw createError({ statusMessage: 'title required' })
  }
  titles = titles.map((title) => title.trim())

  let retData: (typeof gameboxes.$inferSelect)[] = []

  const splitLimit = 80
  let titlesLeft = [...titles]
  while (titlesLeft.length > 0) {
    const toSlice = titlesLeft.length > splitLimit ? splitLimit : titlesLeft.length
    const titlesNow = titlesLeft.slice(0, toSlice)
    const data = await db.select().from(gameboxes).where(arrayOverlaps(gameboxes.titles, titlesNow))
    retData = retData.concat(data)
    titlesLeft = titlesLeft.slice(toSlice)
  }

  return retData.map((item) => gameBoxFromDb(item))
})
