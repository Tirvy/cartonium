export const useUpdateClubData = () => {

  return async function (clubname: string | undefined) {
    const clubnameToCheck = clubname;

    if (!clubnameToCheck || clubnameToCheck === 'undefined') {
      return null;
    }

    const clubData: Club = await $fetch('/api/supabase/club-data', {
      query: {
        clubname: clubnameToCheck,
      }
    });
    return clubData;
  }
}
