
export const useGetGlobalPermissions = async () => {
  const allPermissions = await $fetch('/api/supabase/my-global-permissions');
  if (!Array.isArray(allPermissions)) {
    return false;
  }
  if (allPermissions.some(item => item.relation_type)) {
    return true;
  }
  return false;
}