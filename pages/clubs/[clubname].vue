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
      const clubname = to.params.clubname as string;

      if (!currentClub.value || currentClub.value.urlName !== clubname) {
        const clubDataUpdate = useUpdateClubData();
        const newClubData = await clubDataUpdate(clubname);
        currentClub.value = newClubData;

        const updateUserPermissions = useUpdateUserPermissions();
        await updateUserPermissions();
      }

    },
  ],
});
</script>

<style></style>