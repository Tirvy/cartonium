<template>
    <div>
        <v-select label="варианты" :items="selectorVariants" :readonly="props.items.length < 2" :value="selectedItemName"
            @input="selectVariant"></v-select>
        <v-img style="max-height: 160px;" v-if="source === 'tesera'" :src="selectedItem.photoUrl"></v-img>
        <div v-if="source === 'bgg'">
            year: {{ selectedItem.year }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { searchResultTesera, searchResultBgg } from "@/types/index.d.ts";

const props = defineProps({
    value: {
        type: Object,
    },
    items: {
        type: Array<searchResultTesera | searchResultBgg>,
        default: [],
    },
    source: {
        type: String,
        default: 'tesera',
        validator(value: string) {
            return ['tesera', 'bgg'].includes(value)
        }
    }
});

const emit = defineEmits<{
    (e: 'input', value: any): void
}>()

function selectVariant(title: string) {
    const variant = props.items.find(item => title === getItemName(item));
    if (!variant) {
        console.log(title, props.items);
    }
    emit('input', variant);
}

function getItemName(item) {
    return `${item.title || item.titles?.join(', ') || 'unknown'} (${item.year})`;
}

const selectorVariants = computed(() => {
    return props.items.map(item => getItemName(item));
})

const selectedItem = computed(() => {
    if (props.value) return props.value;
    return {};
})

const selectedItemName = computed(() => {
    return getItemName(selectedItem.value);
})
</script>