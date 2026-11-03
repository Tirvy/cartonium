import { and, eq } from 'drizzle-orm'
import { db } from '#server/db'
import { profilesClubRights } from '#server/db/schema'
import requireUser from '#server/utils/require-user'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const query = getQuery(event)
  const userid = (query.userid as string) || user.id
  const clubid = query.clubid as string

  // Only allow reading own permissions (replaces former RLS auth.uid() = profile_id)
  if (userid !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Cannot read another user permissions' })
  }

  if (!clubid) {
    return []
  }

  return db
    .select()
    .from(profilesClubRights)
    .where(and(eq(profilesClubRights.profile_id, userid), eq(profilesClubRights.club_id, clubid)))
})
