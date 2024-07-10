<script setup lang="ts">
definePageMeta({
  layout: "login",
})
const user = useSupabaseUser()
const defaultPage = useDefaultPage();

watch(user, () => {
  if (user.value) {
    return navigateTo(defaultPage)
  }
}, { immediate: true })
</script>

<template>
  <div>
    <p class="u-text-black">
      Redirecting...
    </p>
  </div>
</template>
