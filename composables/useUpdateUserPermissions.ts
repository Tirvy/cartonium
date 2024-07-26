export const useUpdateUserPermissions = () => {
  return async function updateUserPermissions() {
    const user = useSupabaseUser()
    const currentClub: Ref<Club | null> = useState('club');

    const clubs = await $fetch('/api/supabase/my-clubs-permissions', {
      query: {
        userid: user?.value?.id,
        clubid: currentClub.value?.id,
      }
    });
    // console.log('permissions updated', clubs);
    const clubPermissions = useState('clubPermissions');
    clubPermissions.value = clubs as { club_id: string, relation_type: string }[];
    useClubPermissions();
  }
}
