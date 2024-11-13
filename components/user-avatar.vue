<template>
  <v-avatar :image="avatar.pictureUrl" color="yellow" size="18" class="avatar-root">
    <v-img :alt="avatar.initials" v-if="avatar.pictureUrl" :src="avatar.pictureUrl"></v-img>
    <template v-else>
      {{ avatar.initials }}
    </template>
  </v-avatar>
</template>

<script lang="ts" setup>
const props = defineProps<{ value: GatheringGuest }>();

const initials = computed(() => {
  let source = props.value?.title;
  return source.split(' ').map((item: string) => item[0].toUpperCase()).join('');
})
const avatar = computed(() => {
  return {
    show: !!props.value,
    pictureUrl: props.value?.imageUrl,
    name: props.value?.title,
    initials: initials.value,
  }
});
</script>

<style scoped>
.avatar-root {
  font-size: 10px;
}
</style>