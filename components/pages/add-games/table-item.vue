<template>
    <div>
        <v-select label="варианты" :items="selectorVariants"
            :model-value="selectedItemName" @update:model-value="selectVariant" :loading="props.loading"></v-select>
        <v-img style="max-height: 120px;" v-if="source === 'tesera'" :src="selectedItem?.photoUrl"></v-img>
        <div>
            year: {{ selectedItem?.year }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GameBoxSearchResult } from "~/types/frontend.ts";
import type { ComponentObjectPropsOptions } from 'vue';


const props = defineProps<{
    modelValue: GameBoxSearchResult | null | undefined,
    items: GameBoxSearchResult[],
    source?: string,
    loading: boolean,
}>()

// const props = defineProps<ComponentObjectPropsOptions<Props>>({
//     modelValue: {
//         type: Object,
//     },
//     items: {
//         type: Array,
//         default: [],
//         required: true,
//     },
//     source: {
//         type: String,
//         default: 'tesera',
//         validator(value: string) {
//             return ['tesera', 'bgg'].includes(value)
//         }
//     }
// });

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void
}>()

function selectVariant(title: string) {
    if (title === '----') {
        emit('update:modelValue', null);
        return;
    }

    const variant = props.items.find(item => title === getItemName(item));
    if (!variant) {
        console.log(title, props.items);
    }
    emit('update:modelValue', variant);
}

function getItemName(item: GameBoxSearchResult) {
    return `${item.title || item.titles?.[0] || 'unknown'}${item.year ? '('+item.year+')' : ''}`;
}

const dummyVariant = {
    title: '----',
    year: null,
}

const selectorVariants = computed(() => {
    return [dummyVariant, ...props.items.map(item => getItemName(item))];
})

const selectedItem = computed(() => {
    return props.modelValue
})

const selectedItemName = computed(() => {
    if (selectedItem.value) {
        return getItemName(selectedItem.value);
    }
    return '----'
})
</script>