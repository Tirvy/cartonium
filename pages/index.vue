<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col class="d-flex justify-center">
        You should not be here
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">

definePageMeta({
  name: 'root-index',
  middleware: [
    async function (to, from) {
      if (to.name === 'root-index') {
        const defaultPage = useDefaultPage();
        return navigateTo(defaultPage);
      }
    },
  ],
});
</script>

<style scoped>
.login-card {
  width: 400px;
}
</style>
