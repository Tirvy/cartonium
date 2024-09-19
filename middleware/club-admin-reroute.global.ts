import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
    console.log({ to, from });
    if (to.fullPath.includes('/admin')) {
        const defaultRedirectPath = useDefaultPage();
        const user = useSupabaseUser()
        if (!user.value) {
            return navigateTo(defaultRedirectPath)
        }
        const isAdmin = await useGetGlobalPermissions();
        console.log(isAdmin);
        console.log(defaultRedirectPath);
        if (!isAdmin) {
            console.log(defaultRedirectPath);
            return navigateTo(defaultRedirectPath)
        }
    }
});