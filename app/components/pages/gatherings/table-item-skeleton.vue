<template>
    <v-card v-if="!mobile && view === 'compact'">
    </v-card>
    <v-card v-if="mobile && view === 'compact'">
    </v-card>
    <v-card v-if="view === 'minimal'">
        <v-col class="d-flex flex-no-wrap justify-start">
            <div>
                <v-avatar class="ma-3" size="50" rounded="0">
                    <v-skeleton-loader type="image" style="width:50px" class="skeleton-img"></v-skeleton-loader>
                </v-avatar>
            </div>
            <div class="skeleton-descr">
                <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
            </div>
            <v-spacer></v-spacer>
        </v-col>
    </v-card>
</template>

<script setup lang="ts">

import { useDisplay } from 'vuetify'
const { mobile } = useDisplay();
const user = useSupabaseUser();
const currentClub: Ref<Club | null> = useState('club');

const props = defineProps<{
    view: 'minimal' | 'compact' | 'full'
}>();

</script>

<style scoped>
.skeleton-card {
    flex: 1 0 auto;
}
.skeleton-img {
    width: 50px;
    height: 50px;
}
.skeleton-descr {
    flex: 1 0 auto;
    max-width: 400px;
}
</style>