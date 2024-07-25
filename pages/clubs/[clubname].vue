<template>
  <NuxtPage>

  </NuxtPage>
</template>

<script lang="ts" setup>
import { abortNavigation } from 'nuxt/app';
import type { Club } from '~/types/frontend';



definePageMeta({
  layout: 'in-da-club',
  validate: async (to) => {
    const currentClub: Ref<Club | null> = useState('club');

    if (currentClub.value?.urlName !== to.params.clubname) {
      const clubname = to.params.clubname as string;
      const clubDataUpdate = useUpdateClubData();
      const newClubData = await clubDataUpdate(clubname);
      return !!newClubData?.id;
    }
    return true;
  },
  middleware: [
    async function (to, from) {
      const currentClub: Ref<Club | null> = useState('club');
      const clubPermissions = useState('clubPermissions');
      const clubname = to.params.clubname as string;

      if (!currentClub.value || currentClub.value.urlName !== clubname) {
        const clubDataUpdate = useUpdateClubData();
        const newClubData = await clubDataUpdate(clubname);
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

    },
  ],
});
</script>

<style></style>