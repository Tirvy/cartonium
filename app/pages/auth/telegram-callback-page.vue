<template>
  <div>

  </div>
</template>

<script lang="ts" setup>

onMounted(async () => {

  const route = useRoute();
  const query = route.query;
  const tgData = query as unknown as TelegramLoginPayload;

  const tryLogin = await $fetch<{ url: string }>('/api/common/telegram-callback', { query });
  if (tryLogin?.url) {
    navigateTo(tryLogin.url, {
      replace: true,
    })
    return;
  }
});

</script>

<style scoped></style>