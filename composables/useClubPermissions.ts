interface ClubPermission {
  relation_type: string,
  club_id: string,
}

export const useClubPermissions = () => {
  const permissions = useState<ClubPermission[]>('clubPermissions', () => []);
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
    permissions.value = clubs;
  }

  const clubPermissions = computed(() => {
    return permissions.value.find(item => item.club_id === currentClub.value.id);
  })

  return {
    clubPermissions,
    update
  };
}