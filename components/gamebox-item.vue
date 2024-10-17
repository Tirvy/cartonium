<template>
    <v-card>
        <div class="d-flex flex-no-wrap justify-start ">
            <v-avatar class="ma-3" size="100" rounded="0">
                <v-img :cover="false" height="100" :src="imageURL"></v-img>
            </v-avatar>
            <v-card-item class="flex-0-1 pl-1" style="min-width: 0;">
                <v-card-title>
                    {{ value.title }}
                    <v-tooltip v-if="mobile" :open-on-click="true" activator="parent" location="top">
                        {{ value.title }}
                    </v-tooltip>
                </v-card-title>
                <v-card-text class="text-medium-emphasis">
                        <v-row>
                            <v-col>
                                RatingTesera: {{ value.ratingTesera }}
                            </v-col>
                            <v-col>
                                PlayersGood: {{ value.playersGood }}
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                RatingBgg: {{ value.ratingBgg }}
                            </v-col>
                            <v-col>
                                Playtime: {{ value.playtimeMin }} - {{ value.playtimeMax }}
                            </v-col>
                        </v-row>
                </v-card-text>
            </v-card-item>
        </div>

    </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { gameBoxFromSupabase } from '~/server/transformers';
import type { GameBox } from '~/types/frontend.js';
import { gameboxPictureGet } from '~/utils/gamebox-picture-get';
const { mobile } = useDisplay();

const props = defineProps<{
    value: GameBox
}>();

const imageURL = computed(() => {
    return gameboxPictureGet(props.value);
});
</script>