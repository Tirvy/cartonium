<template>
  <NuxtPage />
</template>

<script lang="ts" setup>


definePageMeta({
  middleware: [
    async function (to, from) {
      const clubPermissions = useClubPermissions();

      if (!clubPermissions) {
        return navigateTo(to.path + '/item');
      }
    },
  ],
});

</script>

<style scoped></style>