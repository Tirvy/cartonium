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

    <v-navigation-drawer location="right" v-model="drawerState">
        <v-list density="compact" nav>
            <v-list-item>
                <v-text-field v-model="filter.title" label="Название" clearable></v-text-field>
            </v-list-item>
            <v-list-item>
                <v-text-field v-model="filter.minRating" :rules="[ruleIsNumber]" label="Рейтинг, min, 0 - 10"
                    clearable></v-text-field>
            </v-list-item>
            <v-list-item>
                <v-text-field v-model="filter.playerCount" :rules="[ruleIsNumber]" label="Кол-во игроков"
                    clearable></v-text-field>
            </v-list-item>
            <v-list-item>
                <v-text-field v-model="filter.maxPlaytime" :rules="[ruleIsNumber]" label="Время игры, max, часов"
                    clearable></v-text-field>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Ref, ComputedRef } from 'vue'
import type { GameBox } from '~/types/frontend.js';
import { ruleIsNumber } from '@/utils/rules.js';
import GameboxItem from '~/components/GameboxItem.vue';


const dataSources = ref([{ name: 'bgg', apiName: 'bgg' }, { name: 'tesera', apiName: 'tesera' }]);
const fetchedCollection: Ref<GameBox[]> = ref([])
const drawerState: Ref<boolean> = ref(true);
const loading: Ref<boolean> = ref(false);

const filter = ref(
    {
        title: '',
        minRating: 0,
        playerCount: 0,
        maxPlaytime: "0",
    }
);

const currentClub: Ref<Club> = useState('club');

const collectionFiltered: ComputedRef<GameBox[]> = computed(() => {
    const title = fetchedCollection.value.filter(item => item.title.toUpperCase().includes(filter.value.title.toUpperCase()))
    const rating = title.filter(item => (item.ratingTesera && item.ratingTesera > filter.value.minRating) || (item.ratingBgg && item.ratingBgg > filter.value.minRating));
    const players = rating.filter(item => !filter.value.playerCount || item.playersGood?.includes(+filter.value.playerCount))
    const playtimeMax = +filter.value.maxPlaytime.trim();
    const playtime = rating.filter(item => !playtimeMax || (item.playtimeMax && item.playtimeMax < +playtimeMax * 60))
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