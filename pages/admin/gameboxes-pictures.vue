<template>
  <v-main>
    <v-container>
      <v-sheet>

        <v-data-table item-value="id" select-strategy="all" v-model="selected"
          :headers="headersGameBoxList" :items="gameboxes" show-select>
        </v-data-table>

      </v-sheet>
      <v-btn @click="getNewPictures">
        get new pictures
      </v-btn>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>

import type { GameBoxWithClub } from '@/types/frontend';

// gameboxes.value = data as GameBoxWithClub[];

const { data, status, error, refresh, clear } = await useFetch('/api/supabase/gameboxes');
const gameboxes: Ref<GameBoxWithClub[]> = ref(data.value.items);

const columns = useConstants('columns');

// const selected: Ref<number[]> = ref(gameboxes.value.map((item: GameBoxWithClub) => item.id));
const selected: Ref<number[]> = ref([]);

async function getNewPictures() {
  const ret = await $fetch('/api/common/add-pictures',
    {
      method: 'post',
      body: { gameBoxIds: selected.value }
    });

  refresh()
  // gameboxes.value = await $fetch('/api/supabase/gameboxes');
}

const headersGameBoxList = [...columns.map((key: string) => {
  return {
    title: key,
    key: key,
  }
})];

</script>

<style scoped></style>