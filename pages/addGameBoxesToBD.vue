<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        Преобразуем список игр в понятный проге
                    </v-card-title>
                    <v-card-actions>
                        <div>
                            <v-textarea label="games list" v-model="gamesList"></v-textarea>
                            <v-btn @click="getGamesTrimmed">Разобрать список</v-btn>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-divider />
            <v-col cols="12">
                <v-card>
                    <v-card-text>
                        <v-table>
                            <tbody>
                                <tr>
                                    <th>title</th>
                                    <th>alias</th>
                                    <th>error</th>
                                </tr>
                                <tr v-for="item in gamesListFormatted" :class="{'text-red': item.error}">
                                    <td>{{ item.title }}</td>
                                    <td>{{ item.alias }}</td>
                                    <td>{{ item.error }}</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="getGamesAliases">Получить alias'ы</v-btn>
                    </v-card-actions>
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
async function getGamesAliases() {
    gamesListFormatted.value.forEach(async (gameInfo: any) => {
        const ret = await $fetch('/api/tesera/search', { query: { title: gameInfo.title } });
        await timeout(200);
        if (!Array.isArray(ret)) {
            gameInfo.error = ret;
            return;
        }
        if (!ret || !ret.length) {
            gameInfo.error = 'not found';
            return;
        }
        gameInfo.alias = ret[0].alias;
    })
    console.log('a');
};
</script>