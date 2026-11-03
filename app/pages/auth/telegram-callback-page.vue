<template>
  <div class="pa-4">Telegram login uses the widget callback via Better Auth. Redirecting…</div>
</template>

<script lang="ts" setup>
onMounted(() => {
  navigateTo(useDefaultPage().path, { replace: true })
})
</script>
