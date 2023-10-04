import type { Database } from './database-visite.js'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<Database>(event)
  const visits = await readBody(event);

  const { data, error } = await client.from('visits').insert(visits)
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})