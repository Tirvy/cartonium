<template>
  <v-main>
    <v-container class="d-flex justify-center">
      <v-sheet max-width="600px" width="600px">
        столы!
      </v-sheet>

      <v-table>
        <thead>
          <tr>
            <td></td>
            <td>
              Имя
            </td>
            <td>
              Описание
            </td>
            <td>
              На сколько человек
            </td>
            <td>

            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="table in tables" :key="table.id">
            <td>
              {{ table.title }}
            </td>
            <td>
              {{ table.description }}
            </td>
            <td>
              {{ table.peopleMax }}
            </td>
            <td>
              <v-btn icon="mdi-pencil" @click="editTable(table)" variant="plain"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-btn @click="newTable">
        <v-icon>mdi-plus</v-icon>
        Добавить
      </v-btn>
    </v-container>
  </v-main>

  <v-dialog transition="dialog-bottom-transition" v-model="tableEditing">
    <v-card prepend-icon="mdi-account" title="редактирование стола">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="4" sm="6">
            <v-text-field label="Название*" required></v-text-field>
          </v-col>

          <v-col cols="12" md="4" sm="6">
            <v-text-field hint="Для отображения предупреждений если это число превышено"
              label="На сколько человек"></v-text-field>
          </v-col>

          <v-col cols="12" md="4" sm="6">
            <v-text-field label="Описание"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Close" variant="plain" @click="tableEditing = undefined"></v-btn>

        <v-btn color="primary" text="Save" variant="tonal" @click="tableEditing = undefined"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
const tables = ref<Table[]>([]);

const editingTable = ref<Table | null>(null);
const tableEditing = computed<boolean | undefined>({
  get() {
    return !!editingTable.value
  },
  set(newValue) {
    if (!newValue) {
      editingTable.value = null;
    }
  }
})



async function getTables() {
  const { data, error } = useFetch('/api/supabase/tables');
  tables.value = data as any;
  console.log(data, error);
}

function editTable(table: Table) {

}

function newTable() {

}


</script>

<style scoped></style>