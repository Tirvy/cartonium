import { inArray } from 'drizzle-orm'
import { serverSupabaseClient } from '#supabase/server'
import { db } from '#server/db'
import { gameboxesWithClubId } from '#server/db/schema'
import { apiURL } from '../bgg/common'
import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser({
  ignoreAttributes: false,
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const client = await serverSupabaseClient(event)

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
    return new Error(
      'Not all thumbnails were downloaded' + thumbnailsURLs.length + ' / ' + gameBoxIds.length,
    )
  }

  function getMime(url: string): string {
    const imgExt = url.split('.').pop() as string
    let mimeType = 'image/png'
    if (imgExt.toLowerCase() !== 'png') {
      mimeType = 'image/jpeg'
    }
    return mimeType
  }

  const requests = []

  for (let i = 0; i < thumbnailsURLs.length; i++) {
    requests.push(await fetchUrlAndSend(thumbnailsURLs[i], gameBoxIds[i]))
  }

  const responses = await Promise.all(requests)

  async function fetchUrlAndSend(url: string, id: number) {
    const picture = await fetch(url).then((x) => x.arrayBuffer())

    // Storage remains on Supabase
    const res = await client.storage.from('gamebox-pics').upload(id + '', picture, {
      contentType: getMime(url),
    })
    return res
  }

  return responses
})
