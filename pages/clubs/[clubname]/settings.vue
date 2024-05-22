<template>
  <NuxtPage />
</template>

<script lang="ts" setup>

definePageMeta({
  middleware: [
    async function (to, from) {
      console.log('ahahahnt mthfka', to.path);
      const currentClub: Ref<Club> = useState('club');
      const clubPermissions = useClubPermissions();

      if (!clubPermissions) {
        return navigateTo('/clubs/' + currentClub.value.urlName + '/collection');
      }
      const newpath = '/clubs/' + currentClub.value.urlName + '/settings/tables';
      if (to.path !== newpath) {
        return navigateTo(newpath);
      }
    },
  ],
});
</script>

<style scoped></style>