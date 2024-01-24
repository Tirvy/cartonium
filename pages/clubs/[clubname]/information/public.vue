<template>
    blablabla
    blablabla
    blablabla
    blablabla
    blablabla
    blablabla
    blablabla
    blablabla
    blablabla
    blablabla
    blablabla
    blablabla

    <v-layout-item model-value class="text-end pointer-events-none" position="bottom" size="88">
        <div class="ma-4 pointer-events-initial">
            <v-btn icon="mdi-pencil-outline" size="large" elevation="8" :to="editPath" @click="gotoEdit" />
        </div>
    </v-layout-item>
</template>

<script setup>
const route = useRoute();
const clubName = route.params.clubname;

const editPath = `/clubs/${clubName}/information/edit`;
const gotoEdit = () => {

}
</script>

<style scoped>
.pointer-events-none {
    pointer-events: none;
}

.pointer-events-initial {
    pointer-events: initial;
}
</style>ƒ