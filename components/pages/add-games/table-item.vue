<template>
    <div>
        <v-select label="варианты" :items="selectorVariants" :readonly="props.items.length < 2"
            :model-value="selectedItemName" @update:model-value="selectVariant"></v-select>
        <v-img style="max-height: 160px;" v-if="source === 'tesera'" :src="selectedItem?.photoUrl"></v-img>
        <div v-if="source === 'bgg'">
            year: {{ selectedItem?.year }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GameBoxSearchResult } from "~/types/frontend.ts";
import type { ComponentObjectPropsOptions } from 'vue';


const props = defineProps<{
    modelValue: GameBoxSearchResult | null,
    items: GameBoxSearchResult[],
    source?: string,
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
    const variant = props.items.find(item => title === getItemName(item));
    if (!variant) {
        console.log(title, props.items);
    }
    emit('update:modelValue', variant);
}

function getItemName(item: GameBoxSearchResult) {
    return `${item.title || item.titles?.join(', ') || 'unknown'}${item.year ? '('+item.year+')' : ''}`;
}

const selectorVariants = computed(() => {
    return props.items.map(item => getItemName(item));
})

const selectedItem = computed((): GameBoxSearchResult | null => {
    return props.modelValue
})

const selectedItemName = computed(() => {
    if (selectedItem.value) {
        return getItemName(selectedItem.value);
    }
    return ''
})
</script>