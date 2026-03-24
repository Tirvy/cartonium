<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">

const currentClub: Ref<Club> = useState('club');
useHead({
  titleTemplate: () => {
    const clubname = currentClub.value?.title;
    return clubname
      ? `${clubname} - Поиск игроков в настолки`
      : 'Поиск игроков в настолки'
  }
})
</script>

<style>
.v-card-title {
  white-space: normal;
}
</style>