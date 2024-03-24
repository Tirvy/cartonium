<template>
    <v-main>
        <v-container>
            <v-card>
                <v-card-text v-html="infoData"></v-card-text>
            </v-card>
        </v-container>
    </v-main>

    <fast-action>
        <v-btn icon="mdi-pencil-outline" size="large" elevation="8" :to="editPath" />
    </fast-action>
</template>

<script setup lang="ts">
const route = useRoute();
const clubName = route.params.clubname;
const editPath = `/clubs/${clubName}/information/edit`;

const infoData = ref('');
const currentClub: Ref<Club> = useState('club');

async function getInfo() {
    // todo make fine handling
    const data = await $fetch('/api/supabase/club-info', {
        query: {
            clubid: currentClub.value.id
        }
    });
    infoData.value = data.text_html;
}
getInfo();
</script>