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
                    <pages-add-games-add-existing :items="controlDataFound"
                        @sendGameboxesToSupabase="addTheseExisting" />
                </v-col>
                <v-divider />

                <v-col cols="12" v-if="loadingProgress.total">
                    <v-img height="400" src="~/assets/images/chill.png" alt="wait" />
                    <p>Подожди, происходит магия</p>
                    <v-progress-linear :model-value="loadingProgress.now * 100 / loadingProgress.total" height="25">
                        <strong>{{ Math.ceil(loadingProgress.now * 100 / loadingProgress.total)
                            }}%</strong></v-progress-linear>
                </v-col>
                <v-col cols="12" v-if="stepNumber === 3">
                    <pages-add-games-add-gameboxes :items="controlDataOutOfClub" @getGameBoxData="getGameBoxData"
                        :loading="loaders.gettingData" @search="searchAgainSpecific" />
                </v-col>
                <v-divider />

                <v-col cols="12" v-if="stepNumber === 4">
                    <pages-add-games-data-verify :items="saveData" @sendGameboxesToSupabase="sendGameboxesToSupabase"
                        :loading="loaders.gettingData" />
                </v-col>
                <v-divider />
                <v-col cols="12" v-if="stepNumber === 5">
                    <pages-add-games-ending />
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
import type { GameBox, GameBoxDataTesera, GameBoxDataBgg, GamedataSource } from '~/types/frontend.js';
import type { SearchedGameBox, SyncTeseraBggMap, GameboxAddData } from "~/types/frontend.ts";
import { ref, computed } from 'vue';
import type { Ref } from 'vue'
import { isNumberObject } from 'util/types';

const loaders: Ref<Loaders> = ref({
    gettingData: false
});

const currentClub: Ref<Club> = useState('club');

const saveData: Ref<GameBox[]> = ref([]);
const snackbar = ref(false);
const snackbarText = ref('wow');

const timeout = (ms: number) => new Promise(res => setTimeout(res, ms));

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

const controlData: Ref<GameboxAddData[]> = ref([]);

const controlDataFound: ComputedRef<GameboxAddData[]> = computed(() => {
    return controlData.value.filter(item => item.foundGamebox);
});

const controlDataOutOfClub = computed(() => {
    return controlData.value.filter(item => !item.indaclub);
})

function showSnackbar(text: string) {
    snackbarText.value = text;
    snackbar.value = true;

}

async function saveGamesList(value: {
    titles: string[],
    gameboxesFound: GameBox[],
    gameboxesInClub: GameBox[]
}) {
    controlData.value = value.titles.map((title) => {
        return {
            name: title,
            foundGamebox: null,
            indaclub: false,
            gameTeseraVariants: [],
            gameBggVariants: [],
            gameTesera: null,
            gameBgg: null,
        }
    });

    value.gameboxesFound.forEach(gamebox => {
        const controlItem = controlData.value.find(cdata => gamebox.titles?.includes(cdata.name));
        if (controlItem) {
            controlItem.foundGamebox = gamebox;
            if (value.gameboxesInClub.find(item => item.id === gamebox.id)) {
                controlItem.indaclub = true;
            }
        } else {
            console.log(gamebox, 'not found');
        }
    });

    if (!value.gameboxesFound.length) {
        await getGamesBaseInfo();
        showSnackbar('Не надено игр в базе, надо импортить из бгг');
        stepNumber.value++;
    } else if (controlData.value.length > value.gameboxesFound.length) {
        showSnackbar('Часть игр найдена, сначала добавь их');
    } else {
        showSnackbar('Все игры найдены');
    }
    stepNumber.value++;
}

async function addTheseExisting(selectedExisting: GameboxAddData[]) {
    selectedExisting.forEach(added => {
        const cdata = controlData.value.find(item => item.name === added.name) as GameboxAddData;
        cdata.indaclub = true;
    })

    if (controlData.value.length > selectedExisting.length) {
        showSnackbar('Добавлены выбранные игры. Остальные надо импортить');
        await getGamesBaseInfo();
    } else {
        showSnackbar('Игры добавлены в клуб. Можно уходить');
    }
    stepNumber.value++;
}

const loadingProgress = ref({
    now: 0,
    total: 0,
});

async function getGamesBaseInfo() {
    const cdataToProgress = controlData.value.filter(item => !item.indaclub);
    loadingProgress.value.now = 0;
    loadingProgress.value.total = cdataToProgress.length;
    loaders.value.gettingData = true;

    cdataToProgress.forEach(async (cdata: GameboxAddData, index: number) => {
        cdata.preciseSearch = cdata.name;
        const resTesera: { items: GameBoxSearchResult[] } = await $fetch('/api/tesera/search', { query: { title: cdata.name } });
        const itemsTesera = resTesera?.items;

        if (Array.isArray(itemsTesera) && itemsTesera.length) {
            cdata.gameTeseraVariants = itemsTesera;
            cdata.gameTesera = itemsTesera[0];

            const searchTitles = [cdata.name];
            const resBgg: { items: GameBoxSearchResult[] } = await $fetch('/api/bgg/search', { query: { titles: searchTitles } });
            const itemsBgg = resBgg?.items;
            if (Array.isArray(itemsBgg) && itemsBgg.length) {
                cdata.gameBggVariants = itemsBgg;
                cdata.gameBgg = itemsBgg[0];
            }
        }

        loadingProgress.value.now++;
        if (loadingProgress.value.now === loadingProgress.value.total) {
            // to force recalc
            controlData.value = [...controlData.value]
            loaders.value.gettingData = false;
            loadingProgress.value.total = 0;
            loadingProgress.value.now = 0;
        }
    });
};

async function searchForeignData(source: GamedataSource, titles: string[]) {
    if (source === 'tesera') {
        const res = await $fetch('/api/tesera/search', { query: { title: titles } });
        return res;
    } else if (source === 'bgg') {
        const res = await $fetch('/api/bgg/search', { query: { titles: titles } });
        return res;
    }
}

async function searchAgainSpecific(cdata: GameboxAddData, source: GamedataSource) {
    if (!cdata?.preciseSearch?.length) {
        return;
    }

    const titles = [cdata.preciseSearch];
    const data = await searchForeignData(source, titles);
    if (Array.isArray(data)) {
        if (source === 'tesera') {
            cdata.gameTeseraVariants = data;
            if (data.length) {
                cdata.gameTesera = data[0];
            } else {
                cdata.gameTesera = null;
            }
        } else {
            cdata.gameBggVariants = data;
            if (data.length) {
                cdata.gameBgg = data[0];
            } else {
                cdata.gameBgg = null;
            }
        }
    }
}


// leech data from bgg and tesera

async function getGameBoxData(syncData: SyncTeseraBggMap) {
    const cdataToProgress = controlData.value.filter(item => {
        return syncData[item.name] && syncData[item.name].selected && (syncData[item.name].gameBgg || syncData[item.name].gameTesera);
    });


    loadingProgress.value.now = 0;
    loadingProgress.value.total = cdataToProgress.length;

    cdataToProgress
        .forEach(async (cdataItem: any, index: number) => {
            const gameInfo = syncData[cdataItem.name];
            let ret = {
                id: 0,
                title: "",
                titles: [] as string[],
                aliasTesera: undefined,
                idBgg: undefined,
                idTesera: undefined,
                linkBgg: undefined,
                linkTesera: undefined,
                photoUrl: undefined,
                playersGood: undefined,
                playersMax: undefined,
                playersMin: undefined,
                playtimeAvg: undefined,
                playtimeMax: undefined,
                playtimeMin: undefined,
                ratingBgg: undefined,
                ratingTesera: undefined,
                year: undefined,
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
            ret.titles.push(cdataItem.name);
            saveData.value.push(ret);
            loadingProgress.value.now++;
            if (loadingProgress.value.now == loadingProgress.value.total) {
                loadingProgress.value.now = 0;
                loadingProgress.value.total = 0;
            }
        });

    stepNumber.value++;
}



// to supabase 

async function sendGameboxesToSupabase() {
    if (saveData.value.length) {
        let ret: GameBox[] = await $fetch('/api/supabase/gamebox-add', {
            method: "POST", body: saveData.value
        });
        loaders.value.gettingData = true;
        await $fetch('/api/supabase/add-games-to-club',
            {
                method: 'post',
                query: { clubid: currentClub.value.id },
                body: { gameBoxIds: ret.map(gameBox => gameBox.id) }
            });

        loaders.value.gettingData = false;
        showSnackbar('Все игры добавлены в бд и в клуб');
        stepNumber.value = 5;
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