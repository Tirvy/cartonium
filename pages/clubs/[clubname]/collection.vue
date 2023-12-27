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

                <v-text-field v-model="filter.title" label="title"></v-text-field>
            </v-list-item>
            <v-list-item>

                <v-text-field v-model="filter.minRating" :rules="[ruleIsNumber]" label="Min Rating, 0 - 10"></v-text-field>
            </v-list-item>
            <v-list-item>

                <v-text-field v-model="filter.playerCount" :rules="[ruleIsNumber]" label="playerCount, 0 - 100"></v-text-field>
            </v-list-item>
        </v-list>
        <v-divider />
        <v-btn @click="fetchData" :loading="loading">Search</v-btn>
    </v-navigation-drawer>
</template>

  
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Ref } from 'vue'
import type { GameBoxInterface, GameBox } from '~/types/gameBox.ts';
import { ruleIsNumber } from '@/utils/rules.ts';
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
    }
);

// {
//     title: ref(''),
//     minRating: ref(0),
// };

const collectionFiltered = computed(() => {
    const title = fetchedCollection.value.filter(item => item.title.toUpperCase().includes(filter.value.title.toUpperCase()))
    const rating = title.filter(item => item.ratingTesera > filter.value.minRating || item.ratingBgg > filter.value.minRating);
    const players = rating.filter(item => !filter.value.playerCount || item.playersGood?.includes(+filter.value.playerCount))
    return players;
});

const fetchData = async () => {
    loading.value = true;
    const ret = await $fetch(`/api/supabase/club-collection`);
    fetchedCollection.value = ret;
    loading.value = false;
}

fetchData();
</script>