<template>
    <v-main>
        <v-container>
            <v-row>
                <v-col cols="12">

                    <v-breadcrumbs :items="breadcrumbItems">
                        <template v-slot:divider>
                            <v-icon icon="mdi-chevron-right"></v-icon>
                        </template>
                    </v-breadcrumbs>
                </v-col>
                <v-col cols="12" v-if="stepNumber === 1">
                    <pages-add-games-list @input="saveGamesList" />
                </v-col>
                <v-divider />
                <v-col cols="12" v-if="stepNumber === 2">
                    <pages-add-games-add-existing :items="gameboxesFound" @sendGameboxesToSupabase="addTheseExisting" />
                </v-col>
                <v-divider />
                <v-col cols="12" v-if="stepNumber === 3">
                    <pages-add-games-add-gameboxes :items="gamesListSearched" @getGameBoxData="getGameBoxData" />
                </v-col>
                <v-divider />
                <v-col cols="12" v-if="stepNumber === 4">
                    <pages-add-games-data-verify :items="saveData" @sendGameboxesToSupabase="sendGameboxesToSupabase" />
                </v-col>
            </v-row>
        </v-container>
        <v-snackbar v-model="snackbar" multi-line>
            {{ snackbarText }}

            <template v-slot:actions>
                <v-btn color="red" variant="text" @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>

    </v-main>
</template>

<script setup lang="ts">
import type { GameBox, GameBoxDataTesera, GameBoxDataBgg } from '~/types/frontend.js';
import type { SearchedGameBox, GameBoxSearchResult } from "~/types/frontend.ts";
import { ref, computed } from 'vue';
import type { Ref } from 'vue'
import { title } from 'process';


const currentClub: Ref<Club> = useState('club');

const saveData: Ref<GameBox[]> = ref([]);
const snackbar = ref(false);
const snackbarText = ref('wow');

const timeout = (ms: number) => new Promise(res => setTimeout(res, ms));
const gamesListSearched: Ref<SearchedGameBox[]> = ref([]);

const stepNumber = ref(1);

const breadcrumbItemsSource = [
    {
        title: 'Вводим список названий',
        disabled: true,
    },
    {
        title: 'Добавляем найденные игры в клуб',
        disabled: true,
    },
    {
        title: 'Подбираем данные с внешних бд',
        disabled: true,
    },
    {
        title: 'Добавляем новые игры в бд и клуб',
        disabled: true,
    },
];

const breadcrumbItems = computed(() => {
    return breadcrumbItemsSource.slice(0, stepNumber.value);
})

// leech aliases from tesera
const getGamesAliasesProgress = ref(0);

const requestInterval = 300;

const gamesTitlesList = ref([]) as Ref<string[]>;
const gameboxesExistingAdded: Ref<GameBox[]> = ref([]);
const gameboxesFound: Ref<GameBox[]> = ref([]);

function showSnackbar(text: string) {
    snackbarText.value = text;
    snackbar.value = true;

}

async function saveGamesList(value: {
    titles: string[],
    gameboxesFound: GameBox[],
    gameboxesInClub: GameBox[]
}) {
    gameboxesFound.value = value.gameboxesFound;
    gamesTitlesList.value = value.titles;

    const gameboxesInClubHashed = listToHashed(value.gameboxesInClub);
    const gameboxesOutOfClub = value.gameboxesFound.filter(gamebox => !gameboxesInClubHashed[gamebox.id]);

    if (!value.gameboxesFound.length) {
        await getGamesBaseInfo(gamesTitlesList.value);
        showSnackbar('Не надено игр в базе, надо импортить из бгг');
        stepNumber.value++;
    } else if (gamesTitlesList.value.length > value.gameboxesFound.length) {
        showSnackbar('Часть игр найдена, сначала добавь их');
    } else {
        showSnackbar('Все игры найдены');
    }
    stepNumber.value++;
}

async function addTheseExisting(selectedExisting: GameBox[]) {
    gameboxesExistingAdded.value = selectedExisting;

    const titlesRemainToAdd = gamesTitlesList.value.filter(title => {
        return !gameboxesExistingAdded.value.find(gamebox => gamebox.titles?.includes(title));
    });

    if (gamesTitlesList.value.length > selectedExisting.length) {
        showSnackbar('Добавлены выбранные игры. Остальные надо импортить');
        await getGamesBaseInfo(titlesRemainToAdd);
    } else {
        showSnackbar('Игры добавлены в клуб. Можно уходить');
    }
    stepNumber.value++;
}

async function getGamesBaseInfo(gamesList: string[]) {

    const retHashed = {} as any;
    gamesListSearched.value = [];

    gamesList.forEach((gameTitle: string, index: number) => {
        setTimeout(async () => {
            const ret: SearchedGameBox = {
                baseTitle: gameTitle,
                gameTeseraVariants: [] as GameBoxSearchResult[],
                gameBggVariants: [] as GameBoxSearchResult[],
                gameTesera: null,
                gameBgg: null,
            }
            const resTesera: any = await $fetch('/api/tesera/search', { query: { title: gameTitle } });

            if (Array.isArray(resTesera) && resTesera.length) {
                ret.gameTeseraVariants = resTesera;
                ret.gameTesera = resTesera[0];
                const resBgg = await $fetch('/api/bgg/search', { query: { titles: resTesera[0].titles } });
                if (Array.isArray(resBgg) && resBgg.length) {
                    ret.gameBggVariants = resBgg;
                    ret.gameBgg = resBgg[0];
                }
            }

            retHashed[ret.baseTitle] = ret;

            if (Object.values(retHashed).length === gamesList.length) {
                getGamesAliasesProgress.value = 0;

                gamesListSearched.value = gamesList.map(gameTitle => {
                    return retHashed[gameTitle];
                });
            } else {
                getGamesAliasesProgress.value = (100 * gamesListSearched.value.length / gamesList.length);
            }
        }, index * requestInterval);
    });
};


// leech data from bgg and tesera

async function getGameBoxData() {
    const requestInterval = 1000;
    if (gamesListSearched.value.length > 0) {
        gamesListSearched.value
            .forEach((gameInfo: any, index: number) => {
                setTimeout(async () => {
                    let ret = {
                        id: 0,
                        title: "",
                        titles: [] as string[],
                        aliasTesera: null,
                        idBgg: null,
                        idTesera: null,
                        linkBgg: null,
                        linkTesera: null,
                        photoUrl: null,
                        playersGood: null,
                        playersMax: null,
                        playersMin: null,
                        playtimeAvg: null,
                        playtimeMax: null,
                        playtimeMin: null,
                        ratingBgg: null,
                        ratingTesera: null,
                        year: null,
                    };
                    if (gameInfo.gameTesera) {
                        let teseraRet: GameBoxDataTesera = await $fetch('/api/tesera/get-gamebox', {
                            query: { alias: gameInfo.gameTesera.alias },
                        });
                        ret.titles.push(teseraRet.title);
                        Object.keys(ret).forEach((key) => {
                            (ret as any)[key] = (ret as any)[key] || (teseraRet as any)[key];
                        });
                    }
                    if (gameInfo.gameBgg) {
                        let bggRet: GameBoxDataBgg = await $fetch('/api/bgg/get-gamebox', {
                            query: { id: gameInfo.gameBgg.id },
                        });
                        ret.titles.push(bggRet.title as string);
                        Object.keys(ret).forEach((key) => {
                            (ret as any)[key] = (ret as any)[key] || (bggRet as any)[key];
                        });
                    }
                    saveData.value.push(ret);
                }, index * requestInterval);
            });
        await timeout((gamesListSearched.value.length + 1) * 1000);
    }

    stepNumber.value++;
}



// to supabase 

async function sendGameboxesToSupabase() {
    if (saveData.value.length) {
        let ret: GameBox[] = await $fetch('/api/supabase/gamebox-add', {
            method: "POST", body: saveData.value
        });
        showSnackbar('Все игры добавлены в бд');
        await $fetch('/api/supabase/add-games-to-club',
            {
                method: 'post',
                query: { clubid: currentClub.value.id },
                body: { gameBoxIds: ret.map(gameBox => gameBox.id) }
            });

        showSnackbar('Все игры добавлены в клуб');
    }
}

// stuff helper

function hashedListToSorted(toSort: any, sortSource: string[]) {
    let ret: any[] = [];
    sortSource.forEach(title => {
        if (toSort[title]) {
            ret.push(toSort[title]);
        }
    })
    return ret;
}

</script>