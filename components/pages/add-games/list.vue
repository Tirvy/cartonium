<template>
    <v-card>
        <v-card-title>
            Введите список игр, которые хотите добавить в коллекцию клуба
        </v-card-title>
        <v-card-subtitle>
            Названия игр должны быть разделены переводом строки. Не больше 100 за раз.
        </v-card-subtitle>
        <v-card-text>
            <v-textarea counter rows="14" class="w-100" row-height="12" label="games list" v-model="gamesList"
                :rules="[ruleMaxRows]">
            </v-textarea>
        </v-card-text>
        <v-card-actions>
            <div>
                <v-btn :disabled="!gamesList" @click="getGamesBaseInfo">
                    Разобрать список
                </v-btn>
            </div>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { title } from 'process';
import data from './data.js';

interface emitedValue {
    titles: string[],
    gameboxesFound: GameBox[],
    gameboxesInClub: GameBox[]
}

const emit = defineEmits<{
    (e: 'input', value: emitedValue): void
}>();

const currentClub: Ref<Club> = useState('club');

// making games list
// const gamesList = ref(data.data);
const gamesList = ref("");

function ruleMaxRows(value: string) {
    const splitted: string[] = value.trim().split(/[\t\n]/);
    return splitted.length < 100;
}

async function getGamesBaseInfo() {
    const splitted: string[] = gamesList.value.trim().split(/[\t\n]/);
    const onlyGoodStrings: string[] = splitted.filter((q: string) => !!q).map((item: string) => item.trim());
    const stringsHashed = onlyGoodStrings.reduce((total, title) => ({ ...total, [title]: true }), {});

    const gameboxesFound: GameBox[] = await $fetch('/api/supabase/check-games-exists', { method: 'POST', body: { titles: Object.keys(stringsHashed) } });
    let gameboxesInClub: number[] = [];
    if (gameboxesFound.length) {
        gameboxesInClub = await $fetch('/api/supabase/check-games-in-club',
            {
                method: 'POST',
                query:
                {
                    clubid: currentClub.value.id,
                },
                body: {
                    ids: gameboxesFound.map(gamebox => gamebox.id)
                }
            });
    }

    emit('input', {
        titles: onlyGoodStrings,
        gameboxesFound: gameboxesFound,
        gameboxesInClub: gameboxesFound.filter(gamebox => gameboxesInClub.includes(gamebox.id)),
    });

    // emit('input', [...new Set(onlyGoodStrings)]);
}


</script>