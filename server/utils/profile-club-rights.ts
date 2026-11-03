import { eq } from 'drizzle-orm'
import type { H3Event, EventHandlerRequest } from 'h3'
import { db } from '#server/db'
import { profilesClubRights } from '#server/db/schema'
import { getOptionalUser } from '#server/utils/require-user'

export default async function profileClubRights(event: H3Event<EventHandlerRequest>) {
  const user = await getOptionalUser(event)

  if (user?.id) {
    const clubs = await db
      .select({ club_id: profilesClubRights.club_id })
      .from(profilesClubRights)
      .where(eq(profilesClubRights.profile_id, user.id))
    return { data: clubs, error: null }
  }
  return []
}
