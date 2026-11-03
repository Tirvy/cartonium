import { eq } from 'drizzle-orm'
import { db } from '#server/db'
import { profilesClubRights } from '#server/db/schema'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user?.id) {
    return []
  }

  return db.select().from(profilesClubRights).where(eq(profilesClubRights.profile_id, user.id))
})
