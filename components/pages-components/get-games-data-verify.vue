<template>
    <v-card>
        <v-card-title>
            Отправляем новые игры в бд
        </v-card-title>
        <v-card-text>
            <v-data-table select-strategy="all" :headers="headersGameBoxList" :items="props.items">
            </v-data-table>
        </v-card-text>
        <v-card-actions>
            <div>
                <v-btn @click="sendGameboxesToSupabase">
                    Отправить в супабейз
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
    (e: 'sendGameboxesToSupabase'): void
}>()

function sendGameboxesToSupabase() {
    emit('sendGameboxesToSupabase');
}

const headersGameBoxList = Object.getOwnPropertyNames(new GameBox({})).map((key: string) => {
    return {
        title: key,
        key: key,
    }
});
</script>