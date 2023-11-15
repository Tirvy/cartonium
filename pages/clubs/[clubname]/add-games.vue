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
                <v-col cols="12">
                    <pages-components-get-games-list :progress="getGamesAliasesProgress" @input="getGamesBaseInfo" />
                </v-col>
                <v-divider />
                <v-col cols="12">
                    <v-card>
                        <v-card-title>
                            Добавляем недостающие игры в бд
                        </v-card-title>
                        <v-card-text>
                            <v-btn-toggle v-model="tableSourceChosen" variant="outlined" color="primary" shaped mandatory>
                                <v-btn v-for="dataSource in dataSources" :value="dataSource">
                                    {{ dataSource.title }}: {{ gamesListFormattedFilteredHashed[dataSource.alias].length }}
                                </v-btn>
                            </v-btn-toggle>
                            <v-table>
                                <thead>
                                    <tr>
                                        <td rowspan="2">
                                            Введенное имя
                                        </td>
                                        <td rowspan="2">
                                            Есть в БД
                                        </td>
                                        <td colspan="2">
                                            Нет в БД
                                        </td>
                                        <td rowspan="2">
                                            Действия
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Игра с тесеры
                                        </td>
                                        <td>
                                            Игра с бгг
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="gameInfo in gamesListSearched" :key="gameInfo.baseTitle">
                                        <td>
                                            {{ gameInfo.baseTitle }}
                                        </td>
                                        <td>
                                            -
                                        </td>
                                        <td class="cell-game-thing">
                                            <PagesComponentsGetGamesTableItem :items="gameInfo.gameTeseraVariants"
                                                :source="'tesera'" :value="gameInfo.gameTesera">
                                            </PagesComponentsGetGamesTableItem>
                                        </td>
                                        <td class="cell-game-thing">
                                            <PagesComponentsGetGamesTableItem :items="gameInfo.gameBggVariants"
                                                :source="'bgg'" :value="gameInfo.gameBgg">
                                            </PagesComponentsGetGamesTableItem>
                                        </td>
                                        <td>
                                            кнопки
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card-text>

                        <v-card-actions>
                            <div>
                                <v-btn @click="getGameBoxData">
                                    Получить данные от внешних бд
                                </v-btn>
                            </div>
                        </v-card-actions>

                    </v-card>
                </v-col>
                <v-divider />
                <v-col cols="12">
                    <v-card>
                        <v-card-title>
                            Отправляем новые игры в бд
                        </v-card-title>
                        <v-card-actions>
                            <div>
                                <v-btn @click="sendGameboxesToSupabase">
                                    Отправить в супабейз
                                </v-btn>
                            </div>
                        </v-card-actions>
                        <v-card-text>
                            <v-data-table select-strategy="all" :headers="headersGameBoxList" :items="saveData">
                            </v-data-table>
                        </v-card-text>

                    </v-card>
                </v-col>
            </v-row>
        </v-container>

    </v-main>
</template>

<script setup lang="ts">
import { GameBox } from "~/types/gameBox.js";
import type { searchResultTesera, searchResultBgg } from "@/types/index.d.ts";
import { Ref, ref, computed } from 'vue';

const saveData: Ref<GameBox[]> = ref([]);

const timeout = (ms: number) => new Promise(res => setTimeout(res, ms));
const gamesListSearched: Ref<SearchedGameBox[]> = ref([]);

interface SearchedGameBox {
    baseTitle: string,
    gameTeseraVariants: searchResultTesera[],
    gameBggVariants: searchResultBgg[],
    gameTesera: searchResultTesera | null,
    gameBgg: searchResultBgg | null,
}

const breadcrumbItems = [
    {
        title: 'Вводим список',
        disabled: false,
        href: 'breadcrumbs_dashboard',
    },
    {
        title: 'Получаем названия',
        disabled: false,
        href: 'breadcrumbs_dashboard',
    },
    {
        title: 'Отправляем данные',
        disabled: false,
        href: 'breadcrumbs_dashboard',
    },
];

// leech aliases from tesera
const getGamesAliasesProgress = ref(0);

const requestInterval = 300;

async function getGamesBaseInfo(gamesList: string[]) {

    const retHashed = {} as any;
    gamesListSearched.value = [];

    gamesList.forEach((gameTitle: string, index: number) => {
        setTimeout(async () => {
            const ret: SearchedGameBox = {
                baseTitle: gameTitle,
                gameTeseraVariants: [] as searchResultTesera[],
                gameBggVariants: [] as searchResultBgg[],
                gameTesera: null,
                gameBgg: null,
            }
            const resTesera: any = await $fetch('/api/tesera/search', { query: { title: gameTitle } });
            console.log(resTesera);

            if (Array.isArray(resTesera) && resTesera.length) {
                ret.gameTeseraVariants = resTesera;
                ret.gameTesera = resTesera[0];
                const resBgg = await $fetch('/api/bgg/search', { query: { titles: resTesera[0].titles } });
                if (Array.isArray(resBgg) && resBgg.length) {
                    ret.gameBggVariants = resBgg;
                    ret.gameBgg = resBgg[0];
                }
            }

            console.log(ret);

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


// data-table
const selected: Ref<string[]> = ref([]);

// leech data from bgg and tesera

async function getGameBoxData() {
    const requestInterval = 200;
    if (gamesListSearched.value.length > 0) {
        gamesListSearched.value
            .forEach((gameInfo: any, index: number) => {
                setTimeout(async () => {
                    let ret = {
                        titles: [] as string[],
                    };
                    if (gameInfo.gameTesera) {
                        let teseraRet: any = await $fetch('/api/tesera/get-gamebox', { query: { alias: gameInfo.gameTesera.alias } });
                        ret.titles.push(teseraRet.title as string);
                        ret = { ...teseraRet, ...ret };
                    }
                    if (gameInfo.gameBgg) {
                        let bggRet: any = await $fetch('/api/bgg/get-gamebox', { query: { id: gameInfo.gameBgg.id } })
                        ret.titles.push(bggRet.title as string);
                        ret = { ...bggRet, ...ret };
                    }
                    saveData.value.push(new GameBox(ret));
                }, index * requestInterval);
            });
        await timeout((gamesListSearched.value.length + 1) * 1000);
    }
};


// headersGameBoxList

const headersGameBoxList = Object.getOwnPropertyNames(new GameBox({})).map((key: string) => {
    return {
        title: key,
        key: key,
    }
});


// table data
const dataSources = ref([
    {
        title: 'Все',
        alias: 'all',
    },
    {
        title: 'Успешные',
        alias: 'ok',
    },
    {
        title: 'Ошибки',
        alias: 'error',
    }
]);
const tableSourceChosen = ref(dataSources.value[0]);

const gamesListFormattedFilteredHashed: any = computed(() => {
    return {
        all: gamesListSearched.value,
        ok: gamesListSearched.value.filter((item: any) => item.alias),
        error: gamesListSearched.value.filter((item: any) => item.error),
    }
})

const gamesListFormattedFiltered = computed(() => {
    return gamesListFormattedFilteredHashed.value[tableSourceChosen.value.alias];
})



// to supabase 

async function sendGameboxesToSupabase() {
    if (saveData.value.length) {
        let ret: any = await $fetch('/api/supabase/gamebox-add', {
            method: "POST", body: saveData.value
        });
        console.log(ret);
    }
}

</script>

<style scoped>
.cell-game-thing {
    vertical-align: top;
    padding: 5px 0;
    width: 30%;
}
</style>