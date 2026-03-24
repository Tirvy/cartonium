<template>
    <v-card>
        <v-card-title>
            Отправляем новые игры в бд
        </v-card-title>
        <v-card-text>
            <v-data-table select-strategy="all" items-per-page="-1" v-model="selected"
                :headers="headersGameBoxList" :items="props.items" item-value="title">
            </v-data-table>
        </v-card-text>
        <v-card-actions>
            <div>
                <v-btn @click="sendGameboxesToSupabase" :loading="loading">
                    Отправить в супабейз
                </v-btn>
            </div>
        </v-card-actions>

    </v-card>
</template>

<script setup lang="ts">

const props = defineProps({
    items: {
        type: Array<GameBox>,
        default: [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
});
const selected: Ref<string[]> = ref([]);

const emit = defineEmits<{
    (e: 'sendGameboxesToSupabase', selected: GameBox[]): void
}>()

function sendGameboxesToSupabase() {
    // const toSend = props.items.filter(item => selected.value.includes(item.title));
    const toSend = props.items;
    emit('sendGameboxesToSupabase', toSend);
}

// unused code когда хотелось сделать и тут галочки
watch((
    () => !!props.loading),
    (loading) => {
        console.log(loading, props.loading)
        if (!loading && selected.value.length === 0) {
            selected.value = props.items.map(item => item.title);
        }
    },
    {
        immediate: true
    })

import columns from './gamebox-columns';

const headersGameBoxList = columns.map((key: string) => {
    return {
        title: key,
        key: key,
    }
});
</script>