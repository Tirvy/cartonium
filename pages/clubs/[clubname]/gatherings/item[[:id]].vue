<template>
    <v-main>
        <v-container class="d-flex justify-center">
            <v-sheet max-width="600px" width="600px">
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
                            <v-text-field label="Как с вами связаться" v-model="contact"
                                placeholder="tg: @gamelover"></v-text-field>

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
                            <v-btn type="submit" :loading="loaders.save">сохранить</v-btn>
                        </v-col>
                    </v-row>

                </v-form>
            </v-sheet>
        </v-container>
    </v-main>
</template>

<script setup lang="ts">
import { start } from 'repl';
import type { Gathering, Loaders } from '~/types/frontend'
import { DateIOFormats } from "@date-io/core/IUtils";
import { useDate } from 'vuetify';
const dateAdapter = useDate()

const route = useRoute();
const router = useRouter();
const item = ref('');

const clubPermissions = useClubPermissions();
const currentClub: Ref<Club> = useState('club');

const timeMaskOptions = { mask: '##:##' };

const loaders: Ref<Loaders> = ref({
    save: false,
    initial: false,
});


async function getBookings(): Promise<Gathering[]> {
    return await $fetch('/api/supabase/gatherings', {
        query: {
            clubid: currentClub.value.id,
        }
    });
}
async function getItem() {
    if (route.params.id && +route.params.id > 0) {
        loaders.value.initial = true;
        const data = await getBookings();
        const findingId = +route.params.id;
        const foundItem = data.find(item => item.id === findingId);
        if (!foundItem) {
            router.replace('./not-found');
        } else {
            startDate.value = dateAdapter.date(foundItem.startDate) as DateIOFormats;
            startTime.value = foundItem.startTime || '';
            guestsMax.value = foundItem.guestsMax + '';
            commentOwner.value = foundItem.commentOwner;
            contact.value = foundItem.contact;
            commentClub.value = foundItem.commentClub;
            gatheringId.value = foundItem.id;
        }
        loaders.value.initial = false;
    }
}

if (route.params.id) {
    getItem();
}

const startDate: Ref<DateIOFormats> = ref(dateAdapter.date() as DateIOFormats);
const startTime = ref('')
const guestsMax = ref('4');
const commentOwner = ref('');
const contact = ref('');

const commentClub = ref('');
const gatheringId = ref(0);


function allowedDates(val: Date) {
    return val > new Date();
};

async function saveGathering() {
    loaders.value.save = true;
    const data: any = await $fetch('/api/supabase/gathering', {
        method: 'post',
        body: {
            id: gatheringId.value || undefined,
            start_date: startDate.value,
            start_time: startTime.value,
            comment_owner: commentOwner.value,
            guests_max: +(guestsMax.value.trim()) || 0,
            contact: contact.value,

            comment_club: commentClub.value,

            club_id: currentClub.value.id,
        }
    })
    const lastGathering = useState('lastGathering');
    lastGathering.value = data;
    navigateTo('./gathering-accepted');
    loaders.value.save = false;
}
</script>