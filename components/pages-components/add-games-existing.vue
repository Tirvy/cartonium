<template>
    <v-card>
        <v-card-title>
            Добавляем игры в клуб (из тех, что есть в бд)
        </v-card-title>
        <v-card-text>
            <v-data-table select-strategy="all" :headers="headersGameBoxList" :items="props.items">
            </v-data-table>
        </v-card-text>
        <v-card-actions>
            <div>
                <v-btn @click="addGameboxesToClubCollection">
                    Добавить выделенные в клуб
                </v-btn>
            </div>
        </v-card-actions>

    </v-card>
</template>

<script setup lang="ts">
import type { GameBox } from '~/types/frontend.js';

const props = defineProps({
    items: {
        type: Array<any>,
        default: [],
    },
});

const emit = defineEmits<{
    (e: 'addGameboxesToClubCollection'): void
}>()

function addGameboxesToClubCollection() {
    emit('addGameboxesToClubCollection');
}

import columns from './gamebox-columns';

const headersGameBoxList = columns.map((key: string) => {
    return {
        title: key,
        key: key,
    }
});
</script>