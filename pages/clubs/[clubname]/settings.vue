<template>
  <NuxtPage />
</template>

<script lang="ts" setup>

definePageMeta({
  middleware: [
    async function (to, from) {
      const currentClub: Ref<Club> = useState('club');
      const clubPermissions = useClubPermissions();

      if (!clubPermissions) {
        return navigateTo('/clubs/' + currentClub.value.urlName + '/collection');
      }
    },
  ],
});
</script>

<style scoped></style>