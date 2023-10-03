<script setup lang="ts">
definePageMeta({
  layout: "login",
})
const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {
    return navigateTo('/clubs/emarena/add-games')
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
