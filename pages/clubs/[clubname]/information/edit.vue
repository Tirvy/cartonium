<template>
    <v-main>
        <v-container>
            <client-only fallback-tag="div" fallback="Loading editor...">
                <QuillEditor theme="snow" />
            </client-only>
        </v-container>
    </v-main>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'


</script>

<style scoped lang="css">
:deep(.ql-editor) {
    min-height: 200px;
}

:deep(.ql-toolbar.ql-snow) {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

:deep(.ql-container.ql-snow) {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
</style>