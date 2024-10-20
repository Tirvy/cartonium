interface ClubPermission {
  relation_type: string,
  club_id: string,
}

export const useClubPermissions = () => {
  const clubPermissions = useState<ClubPermission[]>('clubPermissions', () => []);
  const currentClub: Ref<Club> = useState('club');

  async function update() {
    const user = useSupabaseUser()
    const currentClub: Ref<Club | null> = useState('club');

    const clubs = await $fetch<ClubPermission[]>('/api/supabase/my-clubs-permissions', {
      query: {
        userid: user?.value?.id,
        clubid: currentClub.value?.id,
      }
    });
    // console.log('permissions updated', clubs);
    clubPermissions.value = clubs;
  }

  return {
    clubPermissions,
    update
  };
}