/**
 * Protect routes that previously relied on @nuxtjs/supabase redirect includes.
 * Attach via definePageMeta({ middleware: 'auth-required' }).
 */
export default defineNuxtRouteMiddleware((to) => {
  const user = useAuthUser()
  if (!user.value) {
    const redirectPath = useCookie('auth-redirect-path')
    redirectPath.value = to.fullPath
    return navigateTo('/')
  }
})
