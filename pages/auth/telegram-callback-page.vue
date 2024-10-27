<template>
  <div>

  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const query = route.query;

onMounted(async () => {


  const result = await $fetch<{ url: string }>('/api/common/try-login', {
    query
  });
  const url = result?.url;
  console.log(url)
  if (url) {
    navigateTo(url, {
      replace: true,
    })
  }
});

</script>

<style scoped></style>