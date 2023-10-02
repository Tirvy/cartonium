import type { Database } from '@/utils/database.d.ts'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<Database>(event)

  const { data, error } = await client.from('visits').select().csv()
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})