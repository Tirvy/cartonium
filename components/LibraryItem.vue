<template>
    <v-card>
        <div class="d-flex flex-no-wrap justify-start ">
            <v-avatar class="ma-3" size="100" rounded="0">
                <v-img height="100" :src="value.computed.photoUrl"></v-img>
            </v-avatar>
            <v-card-item class="flex-0-1" style="min-width: 0;">
                <v-card-title>
                    {{ value.computed.title }}
                </v-card-title>
                <v-card-subtitle>
                    <div>
                        <v-chip class="ma-2" color="pink" v-if="value.computed.like">
                            like
                        </v-chip>
                        <v-chip class="ma-2" color="green" v-if="value.computed.wantToPlay">
                            wantToPlay
                        </v-chip>
                        <v-chip class="ma-2" color="blue" v-if="value.computed.own">
                            own
                        </v-chip>
                    </div>
                </v-card-subtitle>
                <v-card-actions>
                </v-card-actions>
            </v-card-item>
        </div>

    </v-card>
</template>

<script setup lang="ts">
const props = defineProps({
    value: {
        type: GameBox,
        required: true,
    },
}); 
</script>