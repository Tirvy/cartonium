<template>
    <v-main>
        <v-container>
            <v-form class="d-flex flex-row">
                <v-row>
                    <v-col>

                        <DateTextPicker v-model="dateFrom"></DateTextPicker>
                    </v-col>
                    <v-col>
                        <v-btn @click="updateFilters">Обновить</v-btn>
                    </v-col>
                </v-row>
            </v-form>
            <v-table>
                <thead>
                    <tr>
                        <th>
                            Дата
                        </th>
                        <th>
                            Время
                        </th>
                        <th>
                            Планируется человек
                        </th>
                        <th class="text-left">
                            Комментарий посетителя
                        </th>
                        <th class="text-left">
                            Комментарий админа
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="gathering in gatherings" :key="gathering.id">
                        <td>{{ dateAdapter.format(gathering.startDate, 'fullDate') }}</td>
                        <td>{{ gathering.startTime }}</td>
                        <td>{{ gathering.guestsMax }}</td>
                        <td>{{ gathering.commentOwner }}</td>
                        <td>{{ gathering.commentClub }}</td>
                        <td>
                            <v-btn icon="mdi-pencil" @click="editGathering(gathering)" variant="plain"></v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-container>
    </v-main>

    <fast-action>
        <NuxtLink to="gatherings/item">
            <v-btn icon="mdi-plus" size="large" elevation="8" />
        </NuxtLink>
    </fast-action>
</template>

<script setup lang="ts">
import { DateIOFormats } from "@date-io/core/IUtils";
import { useDate } from 'vuetify';
const dateAdapter = useDate()
const gatherings: Ref<Gathering[]> = ref([]);

const dateFrom = ref(dateAdapter.startOfDay(dateAdapter.date()) as DateIOFormats);

const currentClub: Ref<Club> = useState('club');
async function updateFilters() {
    const data = await $fetch('/api/supabase/gatherings', {
        query: {
            clubid: currentClub.value.id,
            ['date-from']: dateAdapter.toISO(dateFrom.value)
        }
    });
    if (Array.isArray(data)) {
        gatherings.value = data;
    }
}
updateFilters();

function editGathering(gathering: Gathering) {
    navigateTo('./gatherings/item' + gathering.id);
}
</script>
