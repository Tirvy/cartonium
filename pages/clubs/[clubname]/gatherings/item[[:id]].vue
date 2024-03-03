<template>
    <v-main>
        <v-container class="d-flex justify-center">
            <v-sheet max-width="600px">
                <v-form>
                    <v-row>
                        <v-col>
                            <date-text-picker label="Дата" v-model="startDate" color="primary"></date-text-picker>

                        </v-col>
                        <v-col>
                            <v-text-field label="Время"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field label="Сколько человек планируется (максимум)" v-model="guestsMax"></v-text-field>

                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-textarea label="Комментарий для админов клуба и/или присоединяющихся игроков"></v-textarea>

                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>

                            <v-row>
                                <v-col>
                                    <v-checkbox v-model="joinEnabled" label="Хотите дать другим присоедениться к партии?"
                                        hide-details="true" density="compact"></v-checkbox>

                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="1">
                                    <div>
                                        <v-divider vertical thickness="4" />

                                    </div>

                                </v-col>
                                <v-col>
                                    <v-row>
                                        <v-text-field label="Сколько человек придет с вами?" v-model="guestsWithHost"
                                            :disabled="!joinEnabled">

                                        </v-text-field>
                                    </v-row>
                                    <v-row>
                                        <v-select label="Кому видна эта сходка?"
                                            :items="['Всему интернету', 'Только по ссылке']"
                                            :disabled="!joinEnabled"></v-select>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-form>
            </v-sheet>
        </v-container>
    </v-main>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const item = ref('');

async function getItem() {
    const { data } = $fetch('/api/supabase/gatherings');
    const foundItem = data.find(item => item.id === route.params.id);
    if (!foundItem) {
        router.replace('./not-found');
    }
}

if (route.params.id) {
    getItem();
}

const startDate = ref(new Date());
const guestsMax = ref(4);
const guestsWithHost = ref(0);

const joinEnabled = ref(false);
</script>