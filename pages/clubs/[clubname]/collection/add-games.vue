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
                <v-col cols="12" v-if="stepNumber === 3">
                    <pages-add-games-add-gameboxes :items="controlDataOutOfClub" @getGameBoxData="getGameBoxData" />
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
import type { SearchedGameBox, SyncTeseraBggMap, GameboxAddData } from "~/types/frontend.ts";
import { ref, computed } from 'vue';
import type { Ref } from 'vue'


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

async function getGamesBaseInfo() {
    const cdataToProgress = controlData.value.filter(item => !item.indaclub);
    let progress = 0;

    cdataToProgress.forEach((cdata: GameboxAddData, index: number) => {
        setTimeout(async () => {
            const resTesera: any = await $fetch('/api/tesera/search', { query: { title: cdata.name } });

            if (Array.isArray(resTesera) && resTesera.length) {
                cdata.gameTeseraVariants = resTesera;
                cdata.gameTesera = resTesera[0];

                const searchTitles = resTesera[0].titles.filter((title: string) => {
                    return !(+title > 1995 && +title < 2040);
                })
                const resBgg = await $fetch('/api/bgg/search', { query: { titles: searchTitles } });
                if (Array.isArray(resBgg) && resBgg.length) {
                    cdata.gameBggVariants = resBgg;
                    cdata.gameBgg = resBgg[0];
                }
            }

            progress++;
            if (progress === cdataToProgress.length) { 
                // to force recalc
                controlData.value = [...controlData.value]
            }
        }, index * requestInterval);
    });
};


// leech data from bgg and tesera

async function getGameBoxData(syncData: SyncTeseraBggMap) {
    const requestInterval = 1000;
    const cdataToProgress = controlData.value.filter(item => syncData[item.name]?.selected);

    if (cdataToProgress.length > 0) {
        cdataToProgress
            .forEach((cdataItem: any, index: number) => {
                setTimeout(async () => {
                    const gameInfo = syncData[cdataItem.name];
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
                    ret.titles.push(cdataItem.name);
                    saveData.value.push(ret);
                }, index * requestInterval);
            });
        await timeout((cdataToProgress.length + 1) * 1000);
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