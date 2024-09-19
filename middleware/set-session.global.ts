export default defineNuxtRouteMiddleware(async (to, from) => {
    console.log({ to, from });
    const tokens = {
        access_token: to.query.telegram_access_token as string,
        refresh_token: to.query.telegram_refresh_token as string
    }
    if (tokens.access_token || tokens.refresh_token) {
        const client = useSupabaseClient();
        const { data, error } = await client.auth.setSession({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        })

        if (error) {
            console.error('session error', error);
            return;
        }

        return navigateTo(
            {
                ...to, 
                query: {
                    ...to.query,
                    telegram_access_token: undefined,
                    telegram_refresh_token: undefined,
                }
            },
            {
                replace: true,

            })
    }
})
