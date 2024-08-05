<template>
    <v-card>
        <v-empty-state title="Игры добавлены"
            text="Они появятся в списке коллекции когда главный админ запустит процедурку" />
        <v-card-actions>
            <nuxt-link :to="'../collection'">
                <v-btn>
                    вернуться к коллекции
                </v-btn>
            </nuxt-link>
        </v-card-actions>

    </v-card>
</template>

<script setup lang="ts">
</script>