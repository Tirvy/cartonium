export const useGetGlobalPermissions = async () => {
  try {
    const allPermissions = await $fetch('/api/db/my-global-permissions')
    if (!Array.isArray(allPermissions)) {
      return false
    }
    if (allPermissions.some((item: { relation_type?: string }) => item.relation_type)) {
      return true
    }
    return false
  } catch {
    return false
  }
}
