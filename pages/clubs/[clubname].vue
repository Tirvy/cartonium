<template>
  <NuxtPage>

  </NuxtPage>
</template>

<script lang="ts" setup>
import { abortNavigation } from 'nuxt/app';


definePageMeta({
  middleware: [
    async function (to, from) {
      const currentClub = useState('club');

      if (!currentClub.value || currentClub.value.title !== to.params.clubname) {
        const newClubData = await getClubData(to.params.clubname);
        if (!newClubData || !newClubData.id) {
          currentClub.value = null;
          return abortNavigation();
        }
        currentClub.value = newClubData;
      
      }

      async function getClubData(clubname: string | undefined) {
        const route = to;
        const clubnameToCheck = clubname || route.params.clubname;

        if (!clubnameToCheck || clubnameToCheck === 'undefined') {
          return null;
        }

        const clubData = await $fetch('/api/supabase/club-data', {
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