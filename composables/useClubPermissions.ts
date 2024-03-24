export const useClubPermissions = () => {
  const clubPermissions = useState('clubPermissions');
  const currentClub: Ref<Club> = useState('club');
  const permissionsOverride = useState('permissionsOverride');
  if (permissionsOverride.value?.active) {
    return permissionsOverride.value.value ? { club_id: currentClub.value.id } : undefined;
  }
  return clubPermissions.value.find(item => item.club_id === currentClub.value.id);
}