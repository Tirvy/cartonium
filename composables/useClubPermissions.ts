let permissionsRet: Ref<{ relation_type: string, club_id: string } | undefined> = ref(undefined);

export const useClubPermissions = (): Ref<{ relation_type: string, club_id: string } | undefined> => {
  const clubPermissions: Ref<{ relation_type: string, club_id: string }[]> = useState('clubPermissions');
  const currentClub: Ref<Club> = useState('club');

  const forcedPermissions = false;//localStorage.getItem('forcePermissions');
  if (forcedPermissions && currentClub.value) {
    switch (forcedPermissions) {
      case 'admin':
      case 'owner':
        permissionsRet.value = {
          relation_type: forcedPermissions,
          club_id: currentClub.value.id
        };
        break;
      case 'guest':
        permissionsRet.value = undefined;
    }
  } else {
    permissionsRet.value = clubPermissions?.value?.find(item => item.club_id === currentClub.value.id);
  }

  return permissionsRet;
}