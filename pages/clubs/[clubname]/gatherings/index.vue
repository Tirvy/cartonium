<template>
    <v-main>
        <v-container>
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">
                            Owner
                        </th>
                        <th class="text-left">
                            comment_owner
                        </th>
                        <th>
                            guests_max
                        </th>
                        <th>
                            start_date
                        </th>
                        <th>
                            start_time
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="gathering in gatherings" :key="gathering.id">
                        <td>{{ gathering.owner }}</td>
                        <td>{{ gathering.commentOwner }}</td>
                        <td>{{ gathering.guestsMax }}</td>
                        <td>{{ gathering.startDate }}</td>
                        <td>{{ gathering.startTime }}</td>
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
</script>
