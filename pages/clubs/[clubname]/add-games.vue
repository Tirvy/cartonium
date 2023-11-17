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
                    <pages-components-get-games-add-gameboxes :items="gamesListSearched" @getGameBoxData="getGameBoxData"/>
                </v-col>
                <v-divider />
                <v-col cols="12">
                    <pages-components-get-games-data-verify :items="saveData" @sendGameboxesToSupabase="sendGameboxesToSupabase" />
                </v-col>
            </v-row>
        </v-container>

    </v-main>
</template>

<script setup lang="ts">
import { GameBox } from "~/types/gameBox.js";
import type { searchResultTesera, searchResultBgg } from "@/types/index.d.ts";
import { ref, computed } from 'vue';

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