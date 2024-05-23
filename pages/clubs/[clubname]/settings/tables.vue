<template>
  <v-main>
    <v-container class="d-flex justify-center">
      <v-sheet max-width="600px" width="600px">
        <v-card-title>
          Список столов
        </v-card-title>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
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
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn @click="newTable">
            <v-icon>mdi-plus</v-icon>
            Добавить
          </v-btn>
        </v-card-actions>
      </v-sheet>

    </v-container>
  </v-main>

  <v-dialog transition="dialog-bottom-transition" v-model="tableEditingDialog" width="700">
    <v-card prepend-icon="mdi-desk" :title="dialogTitle">
      <v-card-text>
        <v-row dense>
          <v-col cols="8">
            <v-text-field label="Название*" v-model="editingTable.title" required></v-text-field>
          </v-col>

          <v-col cols="4">
            <v-text-field hint="Для предупреждений" v-model="editingTable.peopleMax" :rules="[ruleIsNumber]"
              label="На сколько человек"></v-text-field>
          </v-col>

        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field label="Описание" v-model="editingTable.description"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Close" variant="plain" @click="tableEditingDialog = false"></v-btn>

        <v-btn color="primary" text="Save" variant="tonal" @click="saveTable"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
const tables = ref<Table[]>([]);
const currentClub: Ref<Club> = useState('club');
import { ruleIsNumber } from '@/utils/rules.js';

const dialogs = ref({
  tableEditing: false,
});
const editingTable = ref<Table>(getDefaultTableValues());

const tableEditingDialog = computed<boolean>({
  get() {
    return dialogs.value.tableEditing
  },
  set(newValue) {
    dialogs.value.tableEditing = newValue;
    if (!newValue) {
      editingTable.value = getDefaultTableValues();
    }
  }
})

function getDefaultTableValues() {
  return {
    id: undefined,
    title: '',
    description: '',
    peopleMax: "4",
    clubId: currentClub.value.id,
  }
}


async function getTables() {
  const { data, error } = useFetch('/api/supabase/club-tables', {
    query: {
      clubid: currentClub.value.id,
    }
  });
  tables.value = data.value;
  console.log(tables.value = data.value);
}
getTables();

function editTable(table: Table) {
  editingTable.value = { ...table };
  tableEditingDialog.value = true;
}

function newTable() {
  editingTable.value = {
    id: undefined,
    title: '',
    description: '',
    peopleMax: "4",
    clubId: currentClub.value.id,
  };
  tableEditingDialog.value = true;
}

const dialogTitle = computed(() => {
  return editingTable.value?.id ? 'Редактирование стола' : 'Новый стол';
})

function saveTable() {
  const table = editingTable.value;
  if (!table) {
    return;
  }

  const { data, error } = useFetch('/api/supabase/club-tables', {
    method: 'POST',
    query: {
      clubid: currentClub.value.id,
    },
    body: {
      id: editingTable.value.id,
      people_max: editingTable.value.peopleMax,
      title: editingTable.value.title,
      description: editingTable.value.description,
      club_id: editingTable.value.clubId,
    }
  });

  if (data.value) {
    tableEditingDialog.value = false;
    getTables();
  }
}


</script>

<style scoped></style>