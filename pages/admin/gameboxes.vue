<template>
  <v-main>
    <v-container>
      <v-sheet>

        <v-text-field :model-value="search" @update:model-value="updateSearch" label="Search"
          prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line></v-text-field>

        <v-data-table :item-value="item => item.id" :headers="headersGameBoxList" :items="gameboxes"
          @update:options="loadItems" :loading="loadign.table" :search="search">


          <template v-slot:item.actions="{ item }">
            <v-icon class="me-2" size="small" @click="editItem(item)">
              mdi-pencil
            </v-icon>
          </template>

        </v-data-table>

      </v-sheet>
    </v-container>


    <v-dialog v-model="editDialog" max-width="500px">
      <v-card v-if="editedItem">
        <v-card-title>
          <span class="text-h5">Изменение (todo, еще не работает) {{ editedItem.aliasTesera }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="editedItem.title" label="title"></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="editedItem.titles" label="titles"></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="editedItem.year" label="year"></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="editedItem.aliasTesera" label="aliasTesera"></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="editedItem.linkTesera" label="linkTesera"></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="editedItem.idBgg" label="linkBgg"></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="editedItem.playersMin" label="playersMin"></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="editedItem.playersMax" label="playersMax"></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="editedItem.playersGood" label="playersGood"></v-text-field>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="editedItem.playtimeMin" label="playtimeMin"></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="editedItem.playtimeMax" label="playtimeMax"></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="editedItem.playtimeAvg" label="playtimeAvg"></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="editedItem.ratingBgg" label="ratingBgg"></v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field v-model="editedItem.ratingTesera" label="ratingTesera"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="editDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="saveEdit">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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


const editedItem = ref<GameBox | null>(null);
const editDialog = computed({
  get: () => {
    return !!editedItem.value;
  },
  set: (value) => {
    if (!value) {
      editedItem.value = null;
    }
  }
})
function editItem(item: GameBox) {
  editedItem.value = Object.assign({}, item)
}
function saveEdit() {
  editDialog.value = false;
  return true;
}

</script>

<style scoped></style>