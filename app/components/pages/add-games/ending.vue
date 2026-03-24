<template>
    <v-card>
        <v-empty-state title="Игры добавлены"
            text="Уже через пару секунд появятся в списке коллекции клуба" />
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