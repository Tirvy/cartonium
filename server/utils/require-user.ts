import { serverSupabaseUser } from '#supabase/server'
import type { H3Event } from 'h3'
import type { User } from '@supabase/auth-js'

/** Require a Supabase Auth session; domain DB identity uses this UUID. */
export default async function requireUser(event: H3Event): Promise<User> {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'User not found' })
  }
  return user
}
