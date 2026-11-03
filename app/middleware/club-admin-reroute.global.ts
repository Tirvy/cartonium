export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) {
    return
  }

  const user = useAuthUser()
  if (!user.value) {
    return navigateTo('/')
  }

  const { data: permissions } = await useGetGlobalPermissions()
  if (!permissions.value?.length) {
    return navigateTo('/')
  }
})
