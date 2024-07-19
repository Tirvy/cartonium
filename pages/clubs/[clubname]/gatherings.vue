<template>
  <NuxtPage />
</template>

<script lang="ts" setup>


definePageMeta({
  name: 'gatherings-root',
  middleware: [
    async function (to, from) {
      const clubPermissions = useClubPermissions();

      // todo: fix kostil'
      const routeSplitted = to.path.split('/');
      const lastOnPath = routeSplitted[routeSplitted.length - 1];
      if (to.name === 'gatherings-root') {
        if (!clubPermissions.value) {
          return navigateTo(to.path + '/table', { replace: true });
        } else {
          return navigateTo(to.path + '/table-admin', { replace: true });
        }
      }

    },
  ],
});

</script>

<style scoped></style>