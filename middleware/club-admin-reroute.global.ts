import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (to.fullPath.includes('/admin')) {
        const defaultRedirectPath = useDefaultPage();
        const user = useSupabaseUser()
        if (!user.value) {
            return navigateTo(defaultRedirectPath)
        }
        const isAdmin = await useGetGlobalPermissions();
        if (!isAdmin) {
            return navigateTo(defaultRedirectPath)
        }
    }
});