export function listToHashed(sortSource: { id?: number | undefined }[]) {
  return sortSource.reduce((total: Record<number, { id?: number }>, item) => {
    if (item.id) {
      total[item.id] = item
    }
    return total
  }, {})
}

/** True when value is a plain object (not null/array/primitive). */
export function isJson(element: unknown): element is Record<string, unknown> {
  if (element === null) return false
  if (typeof element !== 'object') return false
  if (Array.isArray(element)) return false
  return true
}
