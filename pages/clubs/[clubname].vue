<template>
  <NuxtPage>

  </NuxtPage>
</template>

<script lang="ts" setup>
import { abortNavigation } from 'nuxt/app';
import type { Club } from '~/types/frontend';


definePageMeta({
  middleware: [
    async function (to, from) {
      const currentClub: Ref<Club | null> = useState('club');
      const clubPermissions = useState('clubPermissions');
      const clubname = to.params.clubname as string;

      if (!currentClub.value || currentClub.value.title !== clubname) {
        const newClubData = await getClubData(clubname);
        if (!newClubData || !newClubData.id) {
          currentClub.value = null;
          return abortNavigation();
        }
        currentClub.value = newClubData;
        await updatePermissions();
      }

      async function updatePermissions() {
        const user = useSupabaseUser()
        const currentClub: Ref<Club | null> = useState('club');

        const clubs = await $fetch('/api/supabase/my-clubs-permissions', {
          query: {
            userid: user?.value?.id,
            clubid: currentClub.value?.id,
          }
        });
        // console.log('permissions updated', clubs);
        clubPermissions.value = clubs as { club_id: string, relation_type: string }[];
      }

      async function getClubData(clubname: string | undefined) {
        const route = to;
        const clubnameToCheck = clubname || route.params.clubname;

        if (!clubnameToCheck || clubnameToCheck === 'undefined') {
          return null;
        }

        const clubData: Club = await $fetch('/api/supabase/club-data', {
          query: {
            clubname: route.params.clubname,
          }
        });
        return clubData;
      }
    },
  ],
});
</script>

<style></style>