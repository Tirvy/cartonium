<template>
    <v-card>
        <v-card-title>
            Введите список игр, которые хотите добавить в коллекцию клуба
        </v-card-title>
        <v-card-subtitle>
            Названия игр должны быть разделены переводом строки
        </v-card-subtitle>
        <v-card-text>
            <v-textarea counter rows="14" class="w-100" row-height="12" label="games list" v-model="gamesList">
            </v-textarea>
        </v-card-text>
        <v-card-actions>
            <div>

                <v-btn :loading="isLoading" :disabled="!gamesList" @click="getGamesBaseInfo">
                    Разобрать список
                </v-btn>
                <v-progress-linear v-if="progress" :model-value="progress"></v-progress-linear>
            </div>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import data from './data.js';
const props = defineProps({
    progress: {
        type: Number,
        default: 0,
    },
});

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
const gamesList = ref(data.data);

const isLoading = computed(() => {
    return props.progress > 0 && props.progress < 1;
});





async function getGamesBaseInfo() {
    const splitted: string[] = gamesList.value.trim().split(/[\t\n]/);
    const onlyGoodStrings: string[] = splitted.filter((q: string) => !!q).map((item: string) => item.trim());

    const gameboxesFound: GameBox[] = await $fetch('/api/supabase/check-games-exists', { query: { titles: onlyGoodStrings } });
    const gameboxesInClub: number[] = await $fetch('/api/supabase/check-games-in-club',
        {
            query:
            {
                clubid: currentClub.value.id,
                ids: gameboxesFound.map(gamebox => gamebox.id)
            }
        });

    emit('input', {
        titles: onlyGoodStrings,
        gameboxesFound: gameboxesFound,
        gameboxesInClub: gameboxesFound.filter(gamebox => gameboxesInClub.includes(gamebox.id)),
    });

    // emit('input', [...new Set(onlyGoodStrings)]);
}


</script>