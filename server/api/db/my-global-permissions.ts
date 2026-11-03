import { eq } from 'drizzle-orm'
import { db } from '#server/db'
import { profilesClubRights } from '#server/db/schema'
import requireUser from '#server/utils/require-user'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  return db.select().from(profilesClubRights).where(eq(profilesClubRights.profile_id, user.id))
})
