import { createReadStream, existsSync } from 'node:fs'
import { sendStream } from 'h3'
import { gameboxPicPath } from '#server/utils/gamebox-pics'

/** Serve runtime-downloaded pics from GAMEBOX_PICS_DIR (works in Nitro production). */
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id || !/^\d+$/.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid gamebox id' })
  }

  const filePath = gameboxPicPath(id)
  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'Picture not found' })
  }

  setHeader(event, 'Content-Type', 'image/jpeg')
  setHeader(event, 'Cache-Control', 'public, max-age=86400')
  return sendStream(event, createReadStream(filePath))
})
