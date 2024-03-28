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
      const clubname = to.params.clubname as string;

      if (!currentClub.value || currentClub.value.title !== clubname) {
        const newClubData = await getClubData(clubname);
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