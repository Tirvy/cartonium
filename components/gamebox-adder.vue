<template>
  <div>
    <v-list>

      <v-list-subheader inset>Folders</v-list-subheader>
      <v-list-item v-for="gamebox in props.gameboxes" :key="gamebox.title" :title="gamebox.title">

        <template v-slot:append>
          <v-btn color="grey-lighten-1" icon="mdi-information" variant="text"></v-btn>
          <v-btn color="grey-lighten-1" icon="mdi-folder" variant="text"></v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-btn variant="flat" @click="addGamebox">

      <template v-slot:append>
        <v-icon icon="mdi-plus"></v-icon>
        Добавить
      </template>
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import type { GameBox } from '~/types/frontend.ts';

const props = defineProps<{
  gameboxes: GameBox[]
}>();

const emits = defineEmits<{
  (e: 'addGamebox', gamebox: GameBox | null): void
}>();

function addGamebox() {

}

</script>

<style></style>