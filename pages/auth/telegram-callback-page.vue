<template>
  <div>

  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const query = route.query;

const result = await useLazyFetch<{ url: string }>('/api/common/telegram-callback', {
  query
});
const url = result.data.value?.url;
if (url) {
  navigateTo(url, {
    replace: true,
  })
}

</script>

<style scoped></style>