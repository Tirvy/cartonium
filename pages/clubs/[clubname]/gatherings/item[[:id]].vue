<template>
    <v-main>
        <v-container class="d-flex justify-center">
            <v-sheet max-width="600px">
                <v-form @submit.prevent="saveGathering">
                    <v-row>
                        <v-col>
                            <date-text-picker label="Дата" v-model="startDate" color="primary"></date-text-picker>

                        </v-col>
                        <v-col>
                            <v-text-field v-maska:[timeMaskOptions] placeholder="12:30" label="Время"
                                v-model="startTime"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field label="Сколько человек планируется (максимум)"
                                v-model="guestsMax"></v-text-field>

                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-textarea label="Комментарий" placeholder="Игры, которые принесёте/хотите забронировать, пожелания админам итд" v-model="commentOwner"></v-textarea>

                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>

                            <v-row>
                                <v-col>
                                    <v-checkbox v-model="joinEnabled"
                                        label="Хотите дать другим присоедениться к партии?" :hide-details="true"
                                        density="compact"></v-checkbox>

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
                                            :items="['Всему интернету', 'Только по ссылке']" :disabled="!joinEnabled"
                                            v-model="visibility"></v-select>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-textarea label="Комментарий админов" v-model="commentClub"></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field label="Название стола"
                                v-model="tableName"></v-text-field>

                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-btn type="submit">сохранить</v-btn>
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

const timeMaskOptions = { mask: '##:##' };

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
const startTime = ref('')
const guestsMax = ref(4);
const guestsWithHost = ref(0);
const commentOwner = ref('');
const visibility = ref('');
const joinEnabled = ref(false);

const commentClub = ref('');
const tableName = ref('');

function saveGathering() {
    const { data } = $fetch('/api/supabase/gatherings', {
        body: {
            start_date: startDate,
            start_time: startTime,
            comment_owner: commentOwner,
            guests_max: guestsMax,
            
            joinEnabled: joinEnabled,
            visibility,
            guests_list: [],

            comment_club: commentClub,
            table_name: tableName,
        }
    })
}
</script>