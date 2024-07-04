<template>
    <v-main>
        <v-container class="d-flex justify-center">
            <v-sheet max-width="600px" width="600px">
                <v-form @submit.prevent="saveGathering" v-model="formIsValid">
                    <v-row>
                        <v-col>
                            <v-date-input label="Дата" prepend-icon="" prepend-inner-icon="$calendar"
                                v-model="startDate" :allowed-dates="dateIsTodayOnward"></v-date-input>
                        </v-col>
                        <v-col>
                            <v-text-field v-maska:[timeMaskOptions] placeholder="12:30" label="Время"
                                v-model="startTime" :rules="[ruleIsTime]"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-autocomplete v-model="gameboxForGathering" :items="gameboxesSearchList"
                                color="blue-grey-lighten-2" item-title="title" item-value="id" label="Выберите игру"
                                :eager="true">
                                <template v-slot:chip="{ props, item }">
                                    <v-chip v-bind="props" :prepend-avatar="item.raw.photoUrl"
                                        :text="item.raw.title"></v-chip>
                                </template>

                                <template v-slot:item="{ props, item }">
                                    <v-list-item v-bind="props" :prepend-avatar="item.raw.photoUrl"
                                        :subtitle="item.raw.year" :title="item.raw.title"></v-list-item>
                                </template>
                            </v-autocomplete>
                        </v-col>
                        <v-col v-if="ownGatheringNameAvailable" cols="4">

                            <v-btn :active="!isClubGamebox" @click="isClubGamebox = !isClubGamebox">
                                Нет в списке?
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row v-if="!isClubGamebox">
                        <p>
                            Если в списке выше нет нужной игры, то вы можете сами указать название игры/встречи здесь.
                        </p>
                        <v-text-field v-model="ownGatheringName"></v-text-field>
                    </v-row>
                    <v-row v-if="reservingAvailable">
                        <v-col>
                            <v-checkbox label="Поискать еще игроков?" v-model="publicGathering"></v-checkbox>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field label="Сколько человек надо на игру (в сумме)" v-model="guestsMax"
                                :rules="[ruleIsNumber]"></v-text-field>
                        </v-col>
                        <v-col v-if="!gatheringId">
                            <v-text-field label="Сколько гостей приведете с собой" v-model="hostGuestsNumber"
                                :rules="[ruleIsNumber]"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-textarea label="Комментарий к встречи" v-model="commentOwner"
                                :disabled="!publicGathering"></v-textarea>
                        </v-col>
                    </v-row>

                    <template v-if="clubPermissions">
                        <v-row>
                            <v-divider />
                        </v-row>
                        <v-row>
                            <v-card-title>
                                Админская часть (не видно гостям)
                            </v-card-title>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-autocomplete label="Стол" v-model="table" :items="tables" item-value="id">
                                    <template v-slot:item="{ props, item }">
                                        <v-list-item v-bind="props" :subtitle="item.raw.description"
                                            :title="item.raw.title"></v-list-item>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-textarea label="Комментарий админов" v-model="commentClub"></v-textarea>
                            </v-col>
                        </v-row>
                    </template>
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
import type { Gathering, Loaders } from '~/types/frontend'
import { DateIOFormats } from "@date-io/core/IUtils";
import { useDate } from 'vuetify';
const dateAdapter = useDate()
const route = useRoute();
const router = useRouter();
const clubPermissions = useClubPermissions();
const user = useSupabaseUser();
const currentClub: Ref<Club> = useState('club');
const formIsValid: Ref<boolean | null> = ref(null);
const reservingAvailable = currentClub.value.guestCanReserve;
const ownGatheringNameAvailable = currentClub.value.guestCanGatherOwn;


const loaders: Ref<Loaders> = ref({
    save: false,
    initial: false,
});


// ---- default form values
const startDate: Ref<DateIOFormats> = ref(dateAdapter.date() as DateIOFormats);
const date = dateAdapter.date();
console.log(date);
const startTime = ref('')
const guestsMax = ref('4');
const commentOwner = ref('');
const commentClub = ref('');
const gatheringId = ref(0);
const gameboxForGathering = ref<number | undefined>(undefined);
const table = ref<number | null>(null);
const hostGuestsNumber = ref("0");
const publicGathering = ref(true);
const isClubGamebox = ref(true);
const ownGatheringName = ref('');

// ---- form setup
const timeMaskOptions = { mask: '#0:##', tokens: { 0: { pattern: /[0-9]/, optional: true }, } };
function allowedDates(val: Date) {
    return val > new Date();
};
const gameboxesSearchList = ref<GameBox[]>([]);
const tables = ref<Table[]>([])

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
function dateIsTodayOnward (date: unknown) {
    return date as Date > yesterday;
}

/* in case it needs optimization
//
const updateGameboxSearch = useDebounce((search: string) => {
    if (search?.length > 2) {
        getClubGameboxes(search);
    }
}, 500);
//
*/

async function getClubGameboxes(search?: string) {
    const foundBoxes: GameBox[] = await $fetch('/api/supabase/club-collection', {
        query: {
            clubid: currentClub.value.id,
            // limit: 14,
            search,
        }
    });
    gameboxesSearchList.value = foundBoxes;
}
getClubGameboxes();

async function getClubTables(search?: string) {
    const foundTables: Table[] = await $fetch('/api/supabase/club-tables', {
        query: {
            clubid: currentClub.value.id,
        }
    });
    tables.value = foundTables;
}
if (clubPermissions) {
    getClubTables();
}

// ---- Checking if we should load previously saved gathering
// ---- getting this previously saved gathering
// ---- navigating to 404 if gathering not found
async function getItem() {
    if (route.params.id && +route.params.id > 0) {
        loaders.value.initial = true;
        const findingId = +route.params.id;
        const foundItem: Gathering = await await $fetch('/api/supabase/gathering-find', {
            query: {
                clubid: currentClub.value.id,
                gatheringid: findingId,
            }
        });

        if (!foundItem) {
            router.replace('./not-found');
        } else {
            startDate.value = dateAdapter.date(foundItem.startDate) as DateIOFormats;
            startTime.value = dateAdapter.format(startDate.value, 'fullTime24h');
            guestsMax.value = foundItem.guestsMax + '';
            commentOwner.value = foundItem.commentOwner;
            commentClub.value = foundItem.commentClub;
            gatheringId.value = foundItem.id;
            gameboxForGathering.value = foundItem.gameboxId;
        }
        loaders.value.initial = false;
    }
}

if (route.params.id) {
    getItem();
}

// ---- gamebox selector




// ---- action on save (so helpful comment)
async function saveGathering() {
    if (!formIsValid.value) {
        formIsValid.value = false;
        return;
    }

    let dateToSend = dateAdapter.date(startDate.value);
    const hoursMinutes = startTime.value.split(":");
    dateToSend = dateAdapter.setHours(dateToSend, +hoursMinutes[0]);
    dateToSend = dateAdapter.setMinutes(dateToSend, +hoursMinutes[1]);

    loaders.value.save = true;
    const data: any = await $fetch('/api/supabase/gathering', {
        method: 'post',
        body: {
            club_id: currentClub.value.id,
            id: gatheringId.value || undefined, // only used if admin/owner edits
            start_date: dateAdapter.toISO(dateToSend),
            gamebox_id: gameboxForGathering.value,
            comment_owner: commentOwner.value,
            guests_max: +(guestsMax.value.trim()) || 0,
            table_id: table.value,
            comment_club: commentClub.value,
            own_name: !isClubGamebox.value ? ownGatheringName.value : undefined,

            with_host: +(hostGuestsNumber.value.trim()) || 0,
        }
    })
    const lastGathering = useState('lastGathering');
    lastGathering.value = data;
    navigateTo('./gathering-accepted');
    loaders.value.save = false;
}
</script>