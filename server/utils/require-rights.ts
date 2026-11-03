import { and, eq } from 'drizzle-orm'
import type { H3Event } from 'h3'
import { db } from '#server/db'
import { profilesClubRights } from '#server/db/schema'
import requireUser, { type AppUser } from '#server/utils/require-user'

export const CLUB_GAMEMASTER = 'gamemaster'

/** True if the user has any profiles_club_rights row (matches /admin UI gate). */
export async function userHasGlobalAdmin(userId: string): Promise<boolean> {
  const rows = await db
    .select({ id: profilesClubRights.id })
    .from(profilesClubRights)
    .where(eq(profilesClubRights.profile_id, userId))
    .limit(1)
  return rows.length > 0
}

export async function userIsClubGamemaster(userId: string, clubId: string): Promise<boolean> {
  const rows = await db
    .select({ id: profilesClubRights.id })
    .from(profilesClubRights)
    .where(
      and(
        eq(profilesClubRights.profile_id, userId),
        eq(profilesClubRights.club_id, clubId),
        eq(profilesClubRights.relation_type, CLUB_GAMEMASTER),
      ),
    )
    .limit(1)
  return rows.length > 0
}

export async function requireGlobalAdmin(event: H3Event): Promise<AppUser> {
  const user = await requireUser(event)
  if (!(await userHasGlobalAdmin(user.id))) {
    throw createError({ statusCode: 403, statusMessage: 'Global admin required' })
  }
  return user
}

export async function requireClubGamemaster(event: H3Event, clubId: string): Promise<AppUser> {
  if (!clubId) {
    throw createError({ statusCode: 400, statusMessage: 'club_id required' })
  }
  const user = await requireUser(event)
  if (!(await userIsClubGamemaster(user.id, clubId))) {
    throw createError({ statusCode: 403, statusMessage: 'Club gamemaster required' })
  }
  return user
}

/** Owner of a gathering, or club gamemaster for that gathering's club. */
export async function requireGatheringOwnerOrClubAdmin(
  event: H3Event,
  gathering: { owner_id: string; club_id: string },
): Promise<AppUser> {
  const user = await requireUser(event)
  if (gathering.owner_id === user.id) {
    return user
  }
  if (await userIsClubGamemaster(user.id, gathering.club_id)) {
    return user
  }
  throw createError({ statusCode: 403, statusMessage: 'Not allowed to modify this gathering' })
}

/** Session user may act as guestId only for self, or as club gamemaster. */
export async function resolveGuestActorUserId(
  event: H3Event,
  guestId: string | undefined,
  clubId: string,
): Promise<{ user: AppUser; actorUserId: string }> {
  const user = await requireUser(event)
  if (!guestId || guestId === user.id) {
    return { user, actorUserId: user.id }
  }
  if (await userIsClubGamemaster(user.id, clubId)) {
    return { user, actorUserId: guestId }
  }
  throw createError({ statusCode: 403, statusMessage: 'Cannot RSVP as another user' })
}
