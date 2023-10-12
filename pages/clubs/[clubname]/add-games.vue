<template>
    <v-main>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-title>
                            Преобразуем список игр в понятный проге
                        </v-card-title>
                        <div class="w-100 d-flex align-start">

                            <v-card-text>
                                <v-textarea class="w-100" clearable variant="outlined" label="games list"
                                    v-model="gamesList">
                                </v-textarea>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn @click="getGamesTrimmed">Разобрать список</v-btn>
                            </v-card-actions>
                        </div>
                    </v-card>
                </v-col>
                <v-divider />
                <v-col cols="12">
                    <v-card>
                        <v-card-title>
                            Получаем alias'ы с тесеры
                        </v-card-title>
                        <v-card-actions>
                            <div>

                                <v-btn :loading="getGamesAliasesLoading" @click="getGamesAliases">Получить
                                    alias'ы</v-btn>
                                <v-progress-linear v-if="getGamesAliasesProgress"
                                    :model-value="getGamesAliasesProgress"></v-progress-linear>
                            </div>
                            <div>

                                <v-btn @click="getGameBoxData">
                                    Получить данные от внешних бд
                                </v-btn>
                            </div>
                            <div>

                                <v-btn>
                                    Отправить всё в супабейз
                                </v-btn>
                            </div>
                        </v-card-actions>
                        <v-card-text>
                            <v-btn-toggle v-model="tableSourceChosen" variant="outlined" color="primary" shaped mandatory>
                                <v-btn v-for="dataSource in dataSources" :value="dataSource">
                                    {{ dataSource.title }}: {{ gamesListFormattedFilteredHashed[dataSource.alias].length }}
                                </v-btn>
                            </v-btn-toggle>
                            <v-data-table v-model="selected" :headers="headersList" :items="gamesListFormatted" show-select
                                item-value="baseTitle">
                            </v-data-table>
                        </v-card-text>

                    </v-card>
                </v-col>
            </v-row>
        </v-container>

    </v-main>
</template>

<script setup lang="ts">
import { GameBox } from "@/types/gameBox.ts";
const saveData: Ref<GameBox[]> = ref([]);


const timeout = (ms: number) => new Promise(res => setTimeout(res, ms));
const gamesListFormatted = ref([]);

// making games list
const gamesList = ref('');
function getGamesTrimmed() {
    const splitted = gamesList.value.trim().split(/[\t\n]/);
    gamesListFormatted.value = splitted.filter((q: string) => !!q).map((item: any) => {
        return {
            baseTitle: item.trim(),
            titles: [],
            alias: '',
            error: '',
        }
    });
}


// leech aliases from tesera
const gameBoxesAliasesGot = ref(0);

const getGamesAliasesProgress = computed(() => {
    return gamesListFormatted.value.length ? (100 * gameBoxesAliasesGot.value / gamesListFormatted.value.length) : 0;
});
const getGamesAliasesLoading = computed(() => {
    return gameBoxesAliasesGot.value > 0 && gameBoxesAliasesGot.value < gamesListFormatted.value.length;
})

async function getGamesAliases() {
    const requestInterval = 200;
    gameBoxesAliasesGot.value = 0;
    if (gamesListFormatted.value.length > 0) {
        gamesListFormatted.value.slice(0, 10).forEach((gameInfo: any, index: number) => {
            setTimeout(async () => {
                const ret = await $fetch('/api/tesera/search', { query: { title: gameInfo.baseTitle } });

                if (!Array.isArray(ret)) {
                    gameInfo.error = ret;
                    return;
                }
                if (!ret || !ret.length) {
                    gameInfo.error = 'not found';
                    return;
                }
                gameInfo.alias = ret[0].alias;
                gameInfo.titles = ['title', 'title2', 'title3'].map((key: string) => ret[0][key]).filter((title: string) => !!title);
                gameBoxesAliasesGot.value++;
            }, index * requestInterval);
        });
        await timeout((gamesListFormatted.value.length + 1) * 1000);
        gamesListFormatted.value = [...gamesListFormatted.value];
    }

};


// data-table
const selected = ref([]);
const headersList =
    [
        {
            key: 'baseTitle',
            title: 'baseTitle',
        },
        {
            align: 'start',
            sortable: false,
            key: 'alias',
            title: 'alias',
        },
        {
            key: 'titles',
            title: 'title',
        },
        { key: 'error', },
    ];
const gameBoxes: GameBox[] = ref([]);






// leech data from bgg

async function getGameBoxData() {
    const requestInterval = 200;
    if (gamesListFormatted.value.length > 0) {
        gamesListFormatted.value.slice(0, 2).forEach((gameInfo: any, index: number) => {
            setTimeout(async () => {
                const teseraRet = await $fetch('/api/tesera/get-game-by-alias', { query: { alias: gameInfo.alias } });
                let bggRet;
                if ((teseraRet as GameBox).idBgg) {
                    bggRet = await $fetch('/api/bgg/search', { query: { id: (teseraRet as GameBox).idBgg } })
                } else {
                    bggRet = await $fetch('/api/bgg/search', { query: { titles: [...gameInfo.titles, gameInfo.baseTitle] } })
                }
                saveData.value.push(new GameBox({
                    ...teseraRet,
                    ...bggRet,
                }));
            }, index * requestInterval);
        });
        await timeout((gamesListFormatted.value.length + 1) * 1000);
        console.log(saveData.value);
    }
};


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

const gamesListFormattedFilteredHashed = computed(() => {
    return {
        all: gamesListFormatted.value,
        ok: gamesListFormatted.value.filter((item: any) => item.alias),
        error: gamesListFormatted.value.filter((item: any) => item.error),
    }
})

const gamesListFormattedFiltered = computed(() => {
    return gamesListFormattedFilteredHashed.value[tableSourceChosen.value.alias];
})

</script>