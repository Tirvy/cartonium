<template>
  <NuxtPage />
</template>

<script lang="ts" setup>


definePageMeta({
  name: 'gatherings-root',
  middleware: [
    async function (to, from) {
      const clubPermissions = useClubPermissions();

      if (to.name === 'gatherings-root') {
        if (!clubPermissions.value) {
          return navigateTo(to.fullPath + '/table', { replace: true });
        } else {
          return navigateTo(to.fullPath + '/table-admin', { replace: true });
        }
      }

    },
  ],
});

</script>

<style scoped></style>