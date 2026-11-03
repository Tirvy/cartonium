export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) {
    return
  }

  const user = useAuthUser()
  if (!user.value) {
    return navigateTo('/')
  }

  const hasPermissions = await useGetGlobalPermissions()
  if (!hasPermissions) {
    return navigateTo('/')
  }
})
