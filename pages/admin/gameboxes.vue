<template>
  <v-main>
    <v-container>
      <v-sheet>

        <v-data-table :item-value="item => item.id" select-strategy="all" v-model="selected"
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

const { data: gameboxes, refresh } = (await useFetch('/api/supabase/gameboxes')) as { data: Ref<GameBoxWithClub[]>, refresh: () => void };
// gameboxes.value = data as GameBoxWithClub[];

const columns = useConstants('columns');

const selected: Ref<number[]> = ref(gameboxes.value.map(item => item.id));

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