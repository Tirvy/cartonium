<template>
    <v-card>
        <div class="d-flex flex-no-wrap justify-start ">
            <v-avatar class="ma-3" size="100" rounded="0">
                <v-img height="100" :src="value.photoUrl || ''"></v-img>
            </v-avatar>
            <v-card-item class="flex-0-1" style="min-width: 0;">
                <v-card-title>
                    {{ value.title }}
                </v-card-title>
                <v-card-subtitle>
                    <v-container>
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
                    </v-container>
                </v-card-subtitle>
            </v-card-item>
        </div>

    </v-card>
</template>

<script setup lang="ts">
import type { GameBox } from '~/types/frontend.js';

const props = defineProps<{
    value: GameBox
}>(); 
</script>