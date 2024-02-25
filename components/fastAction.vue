
// place at the root level of a page template

<template>
    <v-layout-item model-value class="text-end pointer-events-none" position="bottom" size="88">
        <div class="ma-4 pointer-events-initial">
            <slot></slot>
        </div>
    </v-layout-item>
</template>

<style scoped>
.pointer-events-none {
    pointer-events: none;
}

.pointer-events-initial {
    pointer-events: initial;
}
</style>