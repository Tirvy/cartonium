<template>
    <v-card>
        <v-card-title>
            Добавляем игры в клуб
        </v-card-title>
        <v-card-text>
            <v-data-table :item-value="item => item.id" select-strategy="all" v-model="selected"
                :headers="headersGameBoxList" :items="gameboxes" show-select>
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
import type { GameBox, GameboxAddData } from '~/types/frontend.js';

interface GameboxWithName extends GameBox {
    name: string;
}

const currentClub: Ref<Club> = useState('club');

const props = defineProps({
    items: {
        type: Array<GameboxAddData>,
        default: [],
    },
});

const emit = defineEmits<{
    (e: 'sendGameboxesToSupabase', selected: Array<GameboxAddData>): void
}>()

const gameboxes: ComputedRef<GameboxWithName[]> = computed(() => {
    return props.items.map(item => ({ name: item.name, ...item.foundGamebox as GameBox }));
})

const selected: Ref<number[]> = ref(gameboxes.value.map(item => item.id));

async function sendGameboxesToSupabase() {
    const ret = await $fetch('/api/supabase/add-games-to-club',
        {
            method: 'post',
            query: { clubid: currentClub.value.id },
            body: { gameBoxIds: selected.value }
        });

    const retValue = props.items.filter(item => {
        return selected.value.find(id => id === item.foundGamebox?.id);
    })
    emit('sendGameboxesToSupabase', retValue);
}

import columns from './gamebox-columns';

const headersGameBoxList = [{ title: 'name', key: 'name' }, ...columns.map((key: string) => {
    return {
        title: key,
        key: key,
    }
})];
</script>