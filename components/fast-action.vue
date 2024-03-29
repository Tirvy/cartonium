
<!-- // place at the root level of a page template -->
<!-- // typical templates: -->
<!-- //  -->
<!-- <v-btn icon="mdi-pencil-outline" size="large" elevation="8" :to="" /> -->
<!-- <v-btn icon="mdi-plus" size="large" elevation="8" :to="" /> -->


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