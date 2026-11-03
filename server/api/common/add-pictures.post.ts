import { inArray } from 'drizzle-orm'
import { mkdir, writeFile } from 'node:fs/promises'
import { db } from '#server/db'
import { gameboxesWithClubId } from '#server/db/schema'
import { apiURL } from '../bgg/common'
import { XMLParser } from 'fast-xml-parser'
import { requireGlobalAdmin } from '#server/utils/require-rights'
import { gameboxPicsDir, gameboxPicPath } from '#server/utils/gamebox-pics'

const parser = new XMLParser({
  ignoreAttributes: false,
})

export default defineEventHandler(async (event) => {
  await requireGlobalAdmin(event)
  const body = await readBody(event)
  const gameBoxIds = body.gameBoxIds as number[]

  const data = await db
    .select()
    .from(gameboxesWithClubId)
    .where(inArray(gameboxesWithClubId.id, gameBoxIds))

  const res = await $fetch(`${apiURL}/thing`, {
    query: { id: data.map((item) => item.id_bgg).join(',') },
  })
  const ret = parser.parse(res as string)

  function getThumbnails() {
    const target = ret.items?.item
    if (Array.isArray(target)) {
      return target.map((item: any) => item?.thumbnail)
    }
    return [target?.thumbnail]
  }

  const thumbnailsURLs = getThumbnails()

  if (thumbnailsURLs.length !== gameBoxIds.length) {
    throw createError({
      statusMessage:
        'Not all thumbnails were downloaded' + thumbnailsURLs.length + ' / ' + gameBoxIds.length,
    })
  }

  const picsDir = gameboxPicsDir()
  await mkdir(picsDir, { recursive: true })

  const responses = []
  for (let i = 0; i < thumbnailsURLs.length; i++) {
    responses.push(await fetchUrlAndSave(thumbnailsURLs[i], gameBoxIds[i]))
  }

  async function fetchUrlAndSave(url: string, id: number) {
    const picture = await fetch(url).then((x) => x.arrayBuffer())
    await writeFile(gameboxPicPath(id), Buffer.from(picture))
    return { path: `/gamebox-pics/${id}`, id }
  }

  return responses
})
