export const useCurrentUserAsGuest = (): GatheringGuest => {
  const user = useSupabaseUser();
  if (!user.value) {
    throw 'omagad no user and useCurrentUserAsGuest';
  }
  const userDataSource = user.value.user_metadata;
  return {
    title: userDataSource.first_name,
    imageUrl: userDataSource.picture,
    messageUrl: '',
    totalGuests: 0,
    id: user.value.id,
    telegramLink: `tg://resolve?domain=${userDataSource.telegram_username}`,
    telegramUsername: userDataSource.telegramUsername,
  }
}
