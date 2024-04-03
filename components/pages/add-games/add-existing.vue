<template>
    <v-card>
        <v-card-title>
            Добавляем игры в клуб
        </v-card-title>
        <v-card-text>
            <v-data-table :item-value="item => item.id" select-strategy="all" v-model="selected" return-object
                :headers="headersGameBoxList" :items="props.items" show-select>
            </v-data-table>
        </v-card-text>
        <v-card-actions>
            <div>
                <v-btn @click="sendGameboxesToSupabase">
                    Добавить выделенные
                </v-btn>
            </div>
        </v-card-actions>

    </v-card>
</template>

<script setup lang="ts">
import type { GameBox } from '~/types/frontend.js';

const currentClub: Ref<Club> = useState('club');

const props = defineProps({
    items: {
        type: Array<GameBox>,
        default: [],
    },
});

const emit = defineEmits<{
    (e: 'sendGameboxesToSupabase', selected: Array<GameBox>): void
}>()

const selected: Ref<GameBox[]> = ref([...props.items]);

async function sendGameboxesToSupabase() {
    const ret = await $fetch('/api/supabase/add-games-to-club',
        {
            method: 'post',
            query: { clubid: currentClub.value.id },
            body: { gameBoxIds: selected.value.map(gameBox => gameBox.id) }
        });
    emit('sendGameboxesToSupabase', selected?.value);
}

import columns from './gamebox-columns';

const headersGameBoxList = columns.map((key: string) => {
    return {
        title: key,
        key: key,
    }
});
</script>