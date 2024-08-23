<template>
  <NuxtPage />
</template>

<script lang="ts" setup>

definePageMeta({
  middleware: [
    async function (to, from) {
      const currentClub: Ref<Club> = useState('club');
      const clubPermissions = useClubPermissions();

      if (!clubPermissions.value) {
        return navigateTo('/clubs/' + currentClub.value.urlName + '/gatherings');
      }
    },
  ],
});
</script>

<style scoped></style>