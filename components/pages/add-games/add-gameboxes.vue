<template>
    <v-card>
        <v-card-title>
            Добавляем недостающие игры в бд
        </v-card-title>
        <v-card-subtitle>
            Для каждой игры выберете её на тесере и бгг. Если их там нет - выбирайте "----" или снимайте галочку
        </v-card-subtitle>
        <v-card-text>
            <v-btn-toggle v-if="false" v-model="tableSourceChosen" variant="outlined" color="primary" shaped mandatory>
                <v-btn v-for="dataSource in dataSources" :value="dataSource">
                    {{ dataSource.title }}: {{ gamesListFormattedFilteredHashed[dataSource.alias].length }}
                </v-btn>
            </v-btn-toggle>
            <v-table>
                <thead>
                    <tr>
                        <td rowspan="2">

                        </td>
                        <td rowspan="2" class="name-column">
                            Введенное имя
                        </td>
                        <td colspan="2">
                            Нет в БД
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
                    <tr v-for="gameInfo in props.items" :key="gameInfo.name">
                        <td class="checkbox-cell">
                            <v-checkbox v-model="localData[gameInfo.name].selected"></v-checkbox>
                        </td>
                        <td class="name-column">
                            <div style="max-width: 250px">
                                <v-textarea v-model="gameInfo.preciseSearch"></v-textarea>
                            </div>
                            <div>
                                Переподтянуть:
                                <v-icon color="info" size="small" icon="mdi-information" end />
                                <v-tooltip activator="parent" location="bottom">
                                    Если нет нужной игры - введите сверху название и нажмите кнопку внизу чтобы перезапустить поиск
                                </v-tooltip>
                            </div>
                            <div>
                                <v-btn @click="emit('search', gameInfo, 'tesera')"> Тесеру</v-btn>
                                <v-btn @click="emit('search', gameInfo, 'bgg')"> БГГ</v-btn>
                            </div>
                        </td>
                        <td class="cell-game-thing">
                            <pages-add-games-table-item :items="gameInfo.gameTeseraVariants" :source="'tesera'"
                                v-model="localData[gameInfo.name].gameTesera" :loading="props.loading">
                            </pages-add-games-table-item>
                        </td>
                        <td class="cell-game-thing">
                            <pages-add-games-table-item :items="gameInfo.gameBggVariants" :source="'bgg'"
                                v-model="localData[gameInfo.name].gameBgg" :loading="props.loading">
                            </pages-add-games-table-item>
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
import type { GameboxAddData, SyncTeseraBggMap } from "~/types/frontend";

const props = defineProps({
    items: {
        type: Array<GameboxAddData>,
        default: [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const localData: Ref<SyncTeseraBggMap> = ref(calcSelectedValue(props.items));

function calcSelectedValue(list: GameboxAddData[]) {
    return list.reduce((total, item) => {
        return {
            ...total,
            [item.name]: {
                selected: true,
                gameTesera: item.gameTesera,
                gameBgg: item.gameBgg,
            }
        }
    }, {})
}

watch((() => props.items),
    (value: GameboxAddData[]) => {
        localData.value = calcSelectedValue(value);
    },
    { immediate: true }
);

const emit = defineEmits<{
    (e: 'getGameBoxData', selected: SyncTeseraBggMap): void
    (e: 'search', gameInfo: GameboxAddData, source: GamedataSource): void
}>()

function getGameBoxData() {
    emit('getGameBoxData', localData.value)
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
        all: props.items,
        ok: props.items.filter((item: any) => item.alias),
        error: props.items.filter((item: any) => item.error),
    }
})

const gamesListFormattedFiltered = computed(() => {
    return gamesListFormattedFilteredHashed.value[tableSourceChosen.value.alias];
})
</script>

<style scoped>
.checkbox-cell {
    width: 30px;
}

.cell-game-thing {
    vertical-align: top;
    padding: 5px 0;
    width: 350px;
}

.name-column {
    word-wrap: break-word;
    max-width: 150px;
    width: 150px;
}
</style>