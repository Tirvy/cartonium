<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const clubPermissions = useState('clubPermissions');


await callOnce(async () => {
  const clubs = await $fetch('/api/supabase/my-clubs-permissions', {
    query: {
      userid: user.value.id,
    }
  });
  clubPermissions.value = clubs;
})
</script>