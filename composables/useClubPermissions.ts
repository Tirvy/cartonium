export const useClubPermissions = (): {relation_type: string, club_id: string} | undefined => {
  const clubPermissions: Ref<{relation_type: string, club_id: string}[]> = useState('clubPermissions');
  const currentClub: Ref<Club> = useState('club');

  return clubPermissions?.value?.find(item => item.club_id === currentClub.value.id);
}