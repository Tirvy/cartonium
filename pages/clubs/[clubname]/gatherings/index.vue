<template>
    <v-main>
        <v-container>
            <v-list>
                <v-list-item v-for="gathering in gatherings" :key="gathering.id">
                     {{ gathering.ownner }}
                </v-list-item>
            </v-list>
        </v-container>
    </v-main>

    <fast-action>
        <NuxtLink to="gatherings/item">
            <v-btn icon="mdi-plus" size="large" elevation="8" />
        </NuxtLink>
    </fast-action>
</template>

<script setup lang="ts">
const gatherings = ref([]);

const currentClub = useState('club');
async function getBookings() {
    const data = await $fetch('/api/supabase/gatherings-get', {
        query: {
            clubid: currentClub.value.id,
        }
    });
}
getBookings();
</script>
