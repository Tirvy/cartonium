export const useClubPermissions = (): { relation_type: string, club_id: string } | undefined => {
  const clubPermissions: Ref<{ relation_type: string, club_id: string }[]> = useState('clubPermissions');
  const currentClub: Ref<Club> = useState('club');

  const forcedPermissions = localStorage.getItem('forcePermissions');
  if (forcedPermissions && currentClub.value) {
    switch (forcedPermissions) {
      case 'admin':
        case 'owner':
        return {
          relation_type: forcedPermissions,
          club_id: currentClub.value.id
        }
      case 'guest':
        return undefined;
    }
  }

  return clubPermissions?.value?.find(item => item.club_id === currentClub.value.id);
}