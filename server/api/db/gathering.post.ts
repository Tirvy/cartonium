import { eq } from 'drizzle-orm'
import { db } from '#server/db'
import { gatherings, gatheringsGuests } from '#server/db/schema'
import { gatheringFromDb } from '#server/transformers'
import requireUser from '#server/utils/require-user'
import {
  requireGatheringOwnerOrClubAdmin,
  userIsClubGamemaster,
} from '#server/utils/require-rights'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const { with_host: _withHost, owner_id: _clientOwnerId, ...rest } = body

  if (rest.id) {
    const [existing] = await db
      .select()
      .from(gatherings)
      .where(eq(gatherings.id, rest.id))
      .limit(1)
    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'Gathering not found' })
    }
    await requireGatheringOwnerOrClubAdmin(event, existing)
  } else if (rest.club_id) {
    // Creating: non-admins may only create if allowed by club settings (enforced in UI);
    // club admins always can. Server still forces owner_id = session user.
    const isGm = await userIsClubGamemaster(user.id, rest.club_id)
    if (!isGm) {
      // guests creating own gatherings is a club setting; keep create open to logged-in users
      // but never trust client owner_id
    }
  }

  const values = {
    ...rest,
    owner_id: user.id,
  }

  // Strip admin-only fields unless club gamemaster
  if (values.club_id && !(await userIsClubGamemaster(user.id, values.club_id))) {
    delete values.table_id
    delete values.comment_club
  }

  let data
  if (values.id) {
    ;[data] = await db
      .insert(gatherings)
      .values(values)
      .onConflictDoUpdate({
        target: gatherings.id,
        set: values,
      })
      .returning()
  } else {
    ;[data] = await db.insert(gatherings).values(values).returning()
  }

  if (!data) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to save gathering' })
  }

  await db
    .insert(gatheringsGuests)
    .values({
      gathering_id: data.id,
      user_id: user.id,
      guests_number: (+body.with_host || 0) + 1,
    })
    .onConflictDoUpdate({
      target: [gatheringsGuests.gathering_id, gatheringsGuests.user_id],
      set: { guests_number: (+body.with_host || 0) + 1 },
    })

  return gatheringFromDb(data)
})
