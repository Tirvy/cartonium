<template>
  <NuxtPage />
</template>

<script lang="ts" setup>


definePageMeta({
  name: 'gatherings-root',
  middleware: [
    async function (to, from) {
      const clubPermissions = useClubPermissions();

      console.log(1);
      if (to.name === 'gatherings-root') {
        console.log(2);
        if (!clubPermissions.value) {
          console.log(to);
          return navigateTo(to.fullPath + '/table', { replace: true });
        } else {
          console.log(3, to);
          return navigateTo(to.fullPath + '/table-admin', { replace: true });
        }
      }

    },
  ],
});

</script>

<style scoped></style>