<template>
  <v-main>
    <v-container>
      <v-row class="justify-space-between">
        <v-col>
        </v-col>
        <v-spacer />
        <v-col>
          <NuxtLink to="./table-admin" v-if="clubPermissions">
            <v-list-item :link="true">
              К виду для админов

            </v-list-item>
          </NuxtLink>
        </v-col>
      </v-row>
      <v-empty-state v-if="!user && gatheringsWithDates.length > 0"
        text="Залогиньтесь через телеграм, чтобы присоединяться к сборам" title="Регистрация бесплатна" />
      <v-row v-for="gathwd in gatheringsWithDates" :key="gathwd.date">
        <v-col v-if="gathwd.type === 'date'">
          <v-list-subheader>
            {{ gathwd.date }}
          </v-list-subheader>
        </v-col>

        <v-col v-else-if="gathwd.gathering">
          <pages-gatherings-table-item :date="gathwd.date" :gathering="gathwd.gathering"
            :loading="loading.gatheringId === gathwd.gathering.id"
            :gatheringComputedValue="gatheringsComputedValues[gathwd.gathering.id]" @showDialogGuests="showDialogGuests"
            @guestSet="guestSet"></pages-gatherings-table-item>
        </v-col>
      </v-row>

      <v-empty-state v-if="gatheringsWithDates.length === 0 && user"
        text="Можете сами начать собирать людей кнопкой '+' снизу-справа" title="Не найдено сборов в клубе" />
      <v-empty-state v-else-if="gatheringsWithDates.length === 0"
        text="Зарегистрируйтесь через телеграм, чтобы начать собирать людей" title="Не найдено сборов в клубе" />
    </v-container>

    <v-fab v-if="user" location="bottom end" icon="mdi-plus" to="./item" app size="large" variant="outlined" order="1">
      <v-icon icon="mdi-plus"></v-icon>
      <v-tooltip activator="parent" location="start">Создать сбор</v-tooltip>
    </v-fab>

    <v-dialog v-model="dialog.guests" width="auto">
      <v-form @submit.prevent="guestsApply">
        <v-card max-width="600" prepend-icon="mdi-account-group" title="Введите количество гостей">

          <template v-slot:text>
            Гости - это люди, которые придут с вами на сбор, но которые не хотят (или не могут) зайти в приложение и
            присоедениться сами
            <v-text-field :rules="[ruleIsNumber, ruleIsNotNegative, ruleLessThanMaxGuests]"
              v-model="guestsDialogNumber">

            </v-text-field>
          </template>

          <template v-slot:actions>
            <v-btn text="Отмена" @click="dialog.guests = false"></v-btn>
            <v-btn text="Ok" type="submit" v-if="gatheringToEdit" :disabled="guestsDialogSame"></v-btn>
          </template>
        </v-card>
      </v-form>
    </v-dialog>
  </v-main>

</template>

<script lang="ts" setup>
import type { Gathering, GatheringWithGuests, GatheringsWithDates, GatheringComputedValue } from '~/types/frontend'
import { useDate } from 'vuetify';
const dateAdapter = useDate();
const gatherings: Ref<GatheringWithGuests[]> = ref([]);
const currentClub: Ref<Club> = useState('club');
const clubPermissions = useClubPermissions();
const user = useSupabaseUser();

const loading = ref({
  gatheringId: 0,
})

definePageMeta({
  name: 'gatherings-public'
});

async function updateFilters() {
  const data = await $fetch('/api/supabase/gatherings', {
    query: {
      clubid: currentClub.value.id,
    }
  });
  if (Array.isArray(data)) {
    gatherings.value = data;
  }
}
updateFilters();

const gatheringsComputedValues = computed<{ [id: string]: GatheringComputedValue }>(() => {

  return gatherings.value.reduce((acc: any, item) => {
    const userGathering = item.guests.find(guest => guest.id === user.value?.id);
    const userIsInThisGathering = !!userGathering && userGathering.totalGuests > 0;
    const notMax = item.guestsMax > item.slotsFilled;
    acc[item.id] = {
      canJoin: !userIsInThisGathering && notMax,
      canLeave: userIsInThisGathering,
      canAddGuests: userIsInThisGathering && notMax,
      hasMyGuests: !!userGathering && userGathering.totalGuests > 1,
      myGuests: !!userGathering && userGathering.totalGuests,
      slotsAvailable: item.guestsMax - item.slotsFilled,
    }

    return acc;
  }, {});
});

interface gatheringsHash {
  [key: string]: GatheringWithGuests[]
}
const gatheringsHashedByDate = computed<gatheringsHash>(() => {
  if (gatherings.value.length > 0) {
    let hashedByDate: gatheringsHash = {};
    gatherings.value.forEach(gathering => {
      const key = dateAdapter.toISO(dateAdapter.startOfDay(dateAdapter.date(gathering.startDate)));
      if (!hashedByDate[key]) {
        hashedByDate[key] = [];
      }
      hashedByDate[key].push(gathering);
    })
    return hashedByDate
  }
  return {};
})
const gatheringsWithDates = computed<GatheringsWithDates[]>(() => {
  const keys = Object.keys(gatheringsHashedByDate.value).sort();
  let ret: GatheringsWithDates[] = [];
  keys.forEach(key => {
    ret.push({
      type: 'date',
      date: dateAdapter.format(dateAdapter.date(key), 'normalDateWithWeekday'),
      gathering: undefined,
    });

    gatheringsHashedByDate.value[key].forEach(gathering => {
      ret.push({
        type: 'gathering',
        date: dateAdapter.format(dateAdapter.date(gathering.startDate), 'fullTime24h').slice(0, 5),
        gathering: gathering
      });
    })
  });
  return ret;
});

async function guestSet(gatheringId: number, number: number) {
  loading.value.gatheringId = gatheringId;
  const data: any = await $fetch('/api/supabase/gatherings-set-guest', {
    method: 'POST',
    body: {
      gathering_id: gatheringId,
      guest_id: user.value?.id,
      number,
    }
  });

  if (!data.error) {
    loading.value.gatheringId = 0;
    updateFilters();
    // todo: add recalc on front! There is code under it!
    // const gatheringWithUser = gatherings.value.find(gathering => gathering.id === gatheringId);
    // const currentUserAsGuest = useCurrentUserAsGuest();
    // let guestUseritem = gatheringWithUser?.guests.find(item => item.id === currentUserAsGuest.id);
    // if (guestUseritem) {
    //   guestUseritem.totalGuests = number
    // } else {
    //   currentUserAsGuest.totalGuests = number;
    //   gatheringWithUser?.guests.push(currentUserAsGuest)
    // }
  }
}


// set guests dialog
const dialog = ref({
  guests: false,
})

const guestsDialogNumber = ref(0);
const gatheringToEdit = ref<Gathering>();
const guestsDialogSame = computed(() => {
  if (!gatheringToEdit.value) return true;
  return gatheringsComputedValues.value[gatheringToEdit.value.id].myGuests === guestsDialogNumber.value;
})
function showDialogGuests(gathering: Gathering) {
  gatheringToEdit.value = gathering;
  guestsDialogNumber.value = gatheringsComputedValues.value[gatheringToEdit.value.id].myGuests - 1;
  dialog.value.guests = true;
}

function ruleLessThanMaxGuests(value: string) {
  const numValue = +value;
  if (isNaN(numValue)) return true;
  if (!gatheringToEdit.value) return false;
  const computedValue = gatheringsComputedValues.value[gatheringToEdit.value.id];
  const myGuests = computedValue.myGuests;
  const availablePlaces = computedValue.slotsAvailable;
  const maxAvailableValue = myGuests + availablePlaces - 1;
  if (numValue > maxAvailableValue) {
    return `Введите число меньше чем оставшееся число мест (${maxAvailableValue})`;
  }
  return true;
}

function guestsApply() {
  dialog.value.guests = false;
  if (!gatheringToEdit.value) return;
  if (gatheringsComputedValues.value[gatheringToEdit.value.id].myGuests !== guestsDialogNumber.value) {
    guestSet(gatheringToEdit.value.id, +guestsDialogNumber.value + 1);
    dialog.value.guests = false;
    gatheringToEdit.value = undefined;
  }
}
</script>

<style scoped>
.gathering-img {
  width: 180px;
  height: 180px;
}
</style>