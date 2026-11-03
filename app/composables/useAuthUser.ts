import { authClient } from '~/utils/auth-client'

/**
 * Reactive Better Auth session user, shaped like former useSupabaseUser for app code.
 */
export function useAuthUser() {
  const session = authClient.useSession()

  return computed(() => {
    const u = session.value?.data?.user as
      | {
          id: string
          name?: string | null
          email?: string | null
          image?: string | null
          telegramId?: string | null
          telegramUsername?: string | null
        }
      | undefined
      | null

    if (!u) {
      return null
    }

    const firstName = (u.name || '').split(' ')[0] || undefined
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      image: u.image,
      telegramId: u.telegramId,
      telegramUsername: u.telegramUsername,
      user_metadata: {
        telegram_id: u.telegramId || undefined,
        full_name: u.name || undefined,
        first_name: firstName,
        avatar_url: u.image || undefined,
        picture: u.image || undefined,
        telegram_username: u.telegramUsername || undefined,
      },
    }
  })
}
