<template>
    <v-main>
        <v-container>
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
                        <td>{{ gathering.startDate }}</td>
                        <td>{{ gathering.startTime }}</td>
                        <td>{{ gathering.guestsMax }}</td>
                        <td>{{ gathering.commentOwner }}</td>
                        <td>{{ gathering.commentClub }}</td>
                        <td>
                            <v-btn icon="mdi-pencil" @click="editGathering(gathering)"  variant="plain"></v-btn>    
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
const gatherings: Ref<Gathering[]> = ref([]);

const currentClub: Ref<Club> = useState('club');
async function getBookings() {
    const data = await $fetch('/api/supabase/gatherings', {
        query: {
            clubid: currentClub.value.id,
        }
    });
    if (Array.isArray(data)) {
        gatherings.value = data;
    }
}
getBookings();

function editGathering(gathering: Gathering) {
    navigateTo('./gatherings/item' + gathering.id);
}
</script>
