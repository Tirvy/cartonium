<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        Преобразуем список игр в понятный проге
                    </v-card-title>
                    <div class="w-100 d-flex align-start">

                        <v-card-text>
                            <v-textarea class="w-100" clearable variant="outlined" label="games list" v-model="gamesList">
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
                    <div class="w-100 d-flex align-start">
                        <v-card-text>
                            <v-btn-toggle v-model="tableSourceChosen" variant="outlined" color="primary" shaped mandatory>
                                <v-btn v-for="dataSource in dataSources" :value="dataSource">
                                    {{ dataSource.title }}: {{ gamesListFormattedFilteredHashed[dataSource.alias].length }}
                                </v-btn>
                            </v-btn-toggle>
                            <v-table>
                                <tbody>
                                    <tr>
                                        <th>title</th>
                                        <th>alias</th>
                                        <th>error</th>
                                    </tr>
                                    <tr v-for="item in gamesListFormattedFiltered" :class="{ 'text-red': item.error }">
                                        <td>{{ item.title }}</td>
                                        <td>{{ item.alias }}</td>
                                        <td>{{ item.error }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card-text>
                        <v-card-actions>
                            <div>

                                <v-btn :loading="getGamesAliasesLoading" @click="getGamesAliases">Получить alias'ы</v-btn>
                                <v-progress-linear v-if="getGamesAliasesProgress"
                                    :model-value="getGamesAliasesProgress"></v-progress-linear>
                            </div>
                        </v-card-actions>
                    </div>

                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
const gamesList = ref('');
function getGamesTrimmed() {
    const splitted = gamesList.value.trim().split(/[\t\n]/);
    gamesListFormatted.value = splitted.filter((q: string) => !!q).map((item: any) => {
        return {
            title: item.trim(),
            alias: '',
            error: '',
        }
    });
}

const timeout = (ms: number) => new Promise(res => setTimeout(res, ms))
const gamesListFormatted = ref([]);
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
        gamesListFormatted.value.forEach((gameInfo: any, index: number) => {
            setTimeout(async () => {
                const ret = await $fetch('/api/tesera/search', { query: { title: gameInfo.title } });

                if (!Array.isArray(ret)) {
                    gameInfo.error = ret;
                    return;
                }
                if (!ret || !ret.length) {
                    gameInfo.error = 'not found';
                    return;
                }
                gameInfo.alias = ret[0].alias;
                gameBoxesAliasesGot.value++;
            }, index * requestInterval);
        });
        await timeout(gamesListFormatted.value.length * 1000);
    }
};

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