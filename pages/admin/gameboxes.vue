<template>
  <v-main>
    <v-container>
      <v-sheet>

        <v-text-field :model-value="search" @update:model-value="updateSearch" label="Search"
          prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line></v-text-field>

        <v-data-table :item-value="item => item.id" :headers="headersGameBoxList" :items="gameboxes"
          @update:options="loadItems" :loading="loadign.table" :search="search">
        </v-data-table>

      </v-sheet>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>

import type { GameBox, GameBoxWithClub } from '@/types/frontend';


const gameboxes: Ref<GameBox[]> = ref([]);



const columns = useConstants('columns');

const headersGameBoxList = [...columns.map((key: string) => {
  return {
    title: key,
    key: key,
  }
})];

const loadign = ref({
  table: false,
})

const search = ref('');
const updateSearch = useDebounce((string: string) => {
  search.value = string
}, 1000)

async function loadItems({ page, itemsPerPage, sortBy, search }: { page: number, itemsPerPage: number, sortBy: { key: string, order: string }, search: string }) {
  loadign.value.table = true;

  const data = await $fetch('/api/supabase/gameboxes', {
    query: { page, itemsPerPage, sortBy, search },
  }) as { items: GameBox[] };

  if (data.items) {
    gameboxes.value = data.items;
  }
  loadign.value.table = false;
}

</script>

<style scoped></style>