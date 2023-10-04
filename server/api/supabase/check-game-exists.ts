import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const alias = (query.alias as string).trim();
  if (!alias) {
    throw createError({ statusMessage: 'alias required' })
  }
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient(event)

  const { data, error } = await client.from('gameboxes').select('aliasTesera').eq('aliasTesera', alias);
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})