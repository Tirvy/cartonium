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
                            Планируется человек
                        </th>
                        <th class="text-left">
                            Комментарий посетителя
                        </th>
                        <th class="text-left">
                            Стол
                        </th>
                        <th class="text-left">
                            Комментарий админа
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="gathwd in gatheringsWithDates" :key="gathwd.date">
                        <template v-if="gathwd.type === 'date'">
                            <td colspan="7">
                                {{ gathwd.date }}
                            </td>
                        </template>

                        <template v-else-if="gathwd.gathering">
                            <td>{{ gathwd.date }}</td>
                            <td>{{ gathwd.gathering.gamebox ? gathwd.gathering.gamebox.title : gathwd.gathering.ownTitle }}</td>
                            <td>{{ gathwd.gathering.guestsMax }}</td>
                            <td>{{ gathwd.gathering.commentOwner }}</td>
                            <td>{{ getTable(gathwd.gathering.tableId)?.title }}</td>
                            <td>{{ gathwd.gathering.commentClub }}</td>
                            <td>
                                <v-btn icon="mdi-pencil" @click="editGathering(gathwd.gathering)"
                                    variant="plain"></v-btn>
                            </td>
                        </template>
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
import type { GatheringWithGuests, GatheringsWithDates } from '~/types/frontend'
import { DateIOFormats } from "@date-io/core/IUtils";
import { useDate } from 'vuetify';
const dateAdapter = useDate()
const gatherings: Ref<GatheringWithGuests[]> = ref([]);
const currentClub: Ref<Club> = useState('club');

const { data: tables } = await useFetch<Table[]>('/api/supabase/club-tables', {
    query: {
        clubid: currentClub.value.id,
    }
});

const dateFrom = ref(dateAdapter.startOfDay(dateAdapter.date()) as DateIOFormats);
const lastDateFrom = ref(dateAdapter.startOfDay(dateAdapter.date()) as DateIOFormats);

async function updateFilters() {
    const data = await $fetch('/api/supabase/gatherings', {
        query: {
            clubid: currentClub.value.id,
            ['date-from']: dateAdapter.toISO(dateFrom.value)
        }
    });
    lastDateFrom.value = dateAdapter.date(dateFrom.value) as DateIOFormats;
    if (Array.isArray(data)) {
        gatherings.value = data;
    }
}
updateFilters();

interface gatheringsHash {
    [key: string]: GatheringWithGuests[]
}
const gatheringsHashedByDate = computed<gatheringsHash>(() => {
    if (gatherings.value.length > 0) {
        let hashedByDate: gatheringsHash = {};
        gatherings.value.forEach(gathering => {
            const key = dateAdapter.toISO(dateAdapter.startOfDay(dateAdapter.date(gathering.startDate)));
            if (!hashedByDate[key]) {
                hashedByDate[key] = [];
            }
            hashedByDate[key].push(gathering);
        })
        return hashedByDate
    }
    return {};
})
const gatheringsWithDates = computed<GatheringsWithDates[]>(() => {
    const keys = Object.keys(gatheringsHashedByDate.value);
    const ret: GatheringsWithDates[] = [];
    keys.forEach(key => {
        ret.push({
            type: 'date',
            date: dateAdapter.format(dateAdapter.date(key), 'normalDateWithWeekday'),
            gathering: undefined,
        });

        gatheringsHashedByDate.value[key].forEach(gathering => {
            ret.push({
                type: 'gathering',
                date: dateAdapter.format(dateAdapter.date(gathering.startDate), 'fullTime'),
                gathering: gathering
            });
        })
    })
    return ret;
});

function getTable(tableId: number | null) {
    return tables.value?.find(item => item.id === tableId);
}

function editGathering(gathering: Gathering) {
    navigateTo('./gatherings/item' + gathering.id);
}
</script>
