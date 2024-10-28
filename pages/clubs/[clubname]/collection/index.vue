<template>
    <v-main>
        <v-container>

            <v-row>
                <v-col cols="12" v-for="item in collectionFiltered" :key="item.id">
                    <v-lazy min-height="100" transition="none">
                        <GameboxItem :value="item" />
                    </v-lazy>
                </v-col>
            </v-row>

        </v-container>
    </v-main>

    <v-navigation-drawer location="right" v-model="drawerState" order="8">
        <v-form @submit.prevent="applyFilter">
            <v-list density="compact" nav>
                <v-list-item>
                    Фильтры
                </v-list-item>
                <v-list-item>
                    <v-text-field v-model="filter.title" label="Название" clearable></v-text-field>
                </v-list-item>
                <v-list-item v-if="settings.collectionSearchRating">
                    <v-text-field v-model="filter.minRating" :rules="[ruleIsNumber]" label="Рейтинг, min, 0 - 10"
                        clearable></v-text-field>
                </v-list-item>
                <v-list-item v-if="settings.collectionSearchPlayers">
                    <v-text-field v-model="filter.playerCount" :rules="[ruleIsNumber]" label="Кол-во игроков"
                        clearable></v-text-field>
                </v-list-item>
                <v-list-item v-if="settings.collectionSearchDuration">
                    <v-text-field v-model="filter.maxPlaytime" :rules="[ruleIsNumber]" label="Время игры, max, часов"
                        clearable></v-text-field>
                </v-list-item>
                <v-list-item>
                    <v-btn type="submit">Искать</v-btn>
                </v-list-item>
            </v-list>
        </v-form>
    </v-navigation-drawer>

    <v-fab v-if="!drawerState" location="top end" icon="mdi-filter-outline" app size="large" variant="elevated"
        order="1" @click="drawerState = true">
    </v-fab>

    <v-fab v-if="clubPermissions && !mobile" location="bottom end" icon="mdi-plus" to="./collection/add-games" app
        size="large" variant="outlined" order="1">
    </v-fab>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Ref, ComputedRef } from 'vue'
import type { GameBox } from '~/types/frontend.js';
import { ruleIsNumber } from '@/utils/rules.js';

const { clubPermissions } = useClubPermissions();

import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()


const dataSources = ref([{ name: 'bgg', apiName: 'bgg' }, { name: 'tesera', apiName: 'tesera' }]);
const fetchedCollection: Ref<GameBox[]> = ref([])
const drawerState: Ref<boolean> = ref(true);
const loading: Ref<boolean> = ref(false);

const currentClub: Ref<Club> = useState('club');
const settings = {
    collectionSearchRating: currentClub.value.collectionSearchRating,
    collectionSearchDuration: currentClub.value.collectionSearchDuration,
    collectionSearchPlayers: currentClub.value.collectionSearchPlayers,
}

definePageMeta({
    name: 'club-collection'
})

const filter = ref(
    {
        title: '',
        minRating: 0,
        playerCount: 0,
        maxPlaytime: "0",
    }
);

setTimeout(() => {
    if (mobile.value) {
        drawerState.value = false;
    }
}, 100)

const filterApplied = ref({ ...filter.value });

function applyFilter() {
    filterApplied.value = { ...filter.value };
    if (mobile.value) {
        drawerState.value = false;
    }
}


const collectionFiltered: ComputedRef<GameBox[]> = computed(() => {
    const filterObj = filterApplied.value;
    const titleValue = (filterObj.title || '').toUpperCase();
    const title = fetchedCollection.value.filter(item => item.title.toUpperCase().includes(titleValue))
    const rating = title.filter(item => (item.ratingTesera && item.ratingTesera > filterObj.minRating) || (item.ratingBgg && item.ratingBgg > filterObj.minRating));
    const players = rating.filter(item => !filterObj.playerCount || item.playersGood?.includes(+filterObj.playerCount))

    const playtimeMax = +filterObj.maxPlaytime.trim();
    const playtime = players.filter(item => !playtimeMax || (item.playtimeMax && item.playtimeMax < +playtimeMax * 60))
    return playtime;
});

const fetchData = async () => {
    loading.value = true;
    const ret: GameBox[] = await $fetch(`/api/supabase/club-collection`, {
        query: {
            clubid: currentClub.value.id,
        }
    });
    fetchedCollection.value = ret;
    loading.value = false;
}

fetchData();
</script>