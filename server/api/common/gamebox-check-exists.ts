export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const alias = typeof query.alias === 'string' ? query.alias.trim() : ''
  if (!alias) {
    throw createError({ statusCode: 400, statusMessage: 'alias required' })
  }

  return $fetch('/api/db/check-games-exists', {
    method: 'POST',
    body: { titles: [alias] },
  })
})
