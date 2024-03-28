export const useClubPermissions = () => {
  const clubPermissions: Ref<{club_id: string}[]> = useState('clubPermissions');
  const currentClub: Ref<Club> = useState('club');
  const permissionsOverride = useState('permissionsOverride');
  if (permissionsOverride.value) {
    return permissionsOverride.value ? { club_id: currentClub.value.id } : undefined;
  }
  return clubPermissions.value.find(item => item.club_id === currentClub.value.id);
}