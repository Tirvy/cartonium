import { join } from 'node:path'

/** Persistent directory for downloaded BGG thumbnails (Docker volume in prod). */
export function gameboxPicsDir() {
  return process.env.GAMEBOX_PICS_DIR || join(process.cwd(), 'public', 'gamebox-pics')
}

export function gameboxPicPath(id: number | string) {
  return join(gameboxPicsDir(), String(id))
}
