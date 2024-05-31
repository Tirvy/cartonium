<template>
  <NuxtPage />
</template>

<script lang="ts" setup>


definePageMeta({
  middleware: [
    async function (to, from) {
      const clubPermissions = useClubPermissions();

      // todo: fix kostil'
      const routeSplitted = to.path.split('/');
      const lastOnPath = routeSplitted[routeSplitted.length - 1];

      if (!clubPermissions && lastOnPath === 'gatherings') {
        return navigateTo(to.path + '/item', { replace: true });
      }
    },
  ],
});

</script>

<style scoped></style>