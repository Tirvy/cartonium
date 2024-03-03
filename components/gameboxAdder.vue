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
import type Gamebox from '@types/gameBox.ts';

const props = defineProps({
  gameboxes: Array<Gamebox>,
});

const emits = defineEmits<{
  addGamebox: [Gamebox | null]
}>();

function addGamebox() {

}

</script>

<style></style>