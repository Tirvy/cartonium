<template>
    <v-main>
        <v-container>
            <v-card>
                <v-card-text v-html="infoData"></v-card-text>
            </v-card>
        </v-container>
    </v-main>

    <v-layout-item model-value class="text-end pointer-events-none" position="bottom" size="88">
        <div class="ma-4 pointer-events-initial">
            <v-btn icon="mdi-pencil-outline" size="large" elevation="8" :to="editPath" />
        </div>
    </v-layout-item>
</template>

<script setup>
const route = useRoute();
const clubName = route.params.clubname;
const editPath = `/clubs/${clubName}/information/edit`;

const infoData = ref('');

async function getInfo() {
    // todo make fine handling
    const data = await $fetch('/api/supabase/club-info');
    infoData.value = data.text_html;
}
getInfo();


</script>

<style scoped>
.pointer-events-none {
    pointer-events: none;
}

.pointer-events-initial {
    pointer-events: initial;
}
</style>ƒ