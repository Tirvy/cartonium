<template>
    <v-main>
        <v-container class="d-flex justify-center">
            <v-sheet max-width="600px" width="600px">
                <v-form @submit.prevent="saveGathering">
                    <v-row>
                        <v-col>
                            <date-text-picker label="Дата" v-model="startDate" :allowed-dates="allowedDates"
                                color="primary"></date-text-picker>

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
                            <v-text-field label="Как с вами связаться" v-model="contact" placeholder="tg: @gamelover"></v-text-field>

                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-textarea label="Комментарий"
                                placeholder="Игры, которые принесёте/хотите забронировать, пожелания админам итд"
                                v-model="commentOwner"></v-textarea>

                        </v-col>
                    </v-row>
                    <v-row v-if="clubPermissions">
                        <v-col>
                            <v-textarea label="Комментарий админов" v-model="commentClub"></v-textarea>
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
import type { Gathering } from '~/types/frontend'

const route = useRoute();
const router = useRouter();
const item = ref('');

const clubPermissions = useClubPermissions();
const currentClub: Ref<Club> = useState('club');

const timeMaskOptions = { mask: '##:##' };

async function getItem() {
    if (route.params.id && +route.params.id > 0) {
        const res: { data: Gathering[] } = await $fetch('/api/supabase/gatherings');
        const data: Gathering[] = res.data;
        const findingId = +route.params.id;
        const foundItem = data.find(item => item.id === findingId);
        if (!foundItem) {
            router.replace('./not-found');
        }
    }
}

if (route.params.id) {
    getItem();
}

const startDate = ref(new Date());
const startTime = ref('')
const guestsMax = ref('4');
const commentOwner = ref('');
const contact = ref('');

const commentClub = ref('');


function allowedDates(val: Date) {
    return val > new Date();
};

async function saveGathering() {
    const data: any = await $fetch('/api/supabase/gathering', {
        method: 'post',
        body: {
            start_date: startDate.value,
            start_time: startTime.value,
            comment_owner: commentOwner.value,
            guests_max: +(guestsMax.value.trim()) || 0,
            contact: contact,
            
            comment_club: commentClub.value,

            club_id: currentClub.value.id,
        }
    })
    console.log(data);
}
</script>