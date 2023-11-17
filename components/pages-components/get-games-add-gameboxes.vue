<template>
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
                            <PagesComponentsGetGamesTableItem :items="gameInfo.gameTeseraVariants" :source="'tesera'"
                                v-model="gameInfo.gameTesera">
                            </PagesComponentsGetGamesTableItem>
                        </td>
                        <td class="cell-game-thing">
                            <PagesComponentsGetGamesTableItem :items="gameInfo.gameBggVariants" :source="'bgg'"
                                v-model="gameInfo.gameBgg">
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
</template>

<script setup lang="ts">

const props = defineProps({
    items: {
        type: Array<any>,
        default: [],
    },
});

const gamesListSearched = ref([]);

watch((() => props.items),
    (value: Array<any>) => {
        gamesListSearched.value = value.map(item => {
            return { ...item };
        });
    },
    { immediate: true }
);

const emit = defineEmits<{
    (e: 'getGameBoxData'): void
}>()

function getGameBoxData() {
    emit('getGameBoxData')
}



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
</script>

<style scoped>
.cell-game-thing {
    vertical-align: top;
    padding: 5px 0;
    width: 30%;
}
</style>