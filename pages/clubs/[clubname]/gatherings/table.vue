<template>
  <v-main>
    <NuxtPage :gatheringsWithDates="gatheringsWithDates" :gatheringsComputedValues="gatheringsComputedValues"
      :loadingId="loading.gatheringId" :loadingList="loading.list" @gatheringRemove="gatheringRemove"
      @gatheringEdit="gatheringEdit" />

    <v-dialog v-model="dialog.guests" width="auto">
      <v-form @submit.prevent="guestsApply">
        <v-card max-width="600" prepend-icon="mdi-account-group" title="Введите количество гостей">

          <template v-slot:text>
            Гости - это люди, которые придут с вами на сбор, но которые не хотят (или не могут) зайти в приложение и
            присоединиться сами
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

    <v-dialog v-model="removaGatheringModal" width="auto">
      <v-card>
        <v-card-title>
          Вы уверены что хотите отменить сбор на
          <p>
            "{{ gatheringToRemove?.ownName || gatheringToRemove?.gamebox.title }}"?
          </p>
        </v-card-title>
        <v-card-actions class="justify-end">
          <v-btn @click="removeGatheringConfirmed" :loading="loading.removeDialogYes">Да</v-btn>
          <v-btn @click="removaGatheringModal = false">Нет</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>

</template>

<script lang="ts" setup>
import type { Gathering, GatheringWithGuests, GatheringsWithDates, GatheringComputedValue } from '~/types/frontend'
import { useDate } from 'vuetify';
const dateAdapter = useDate();
const currentClub: Ref<Club> = useState('club');
const { data: gatherings, refresh: updateGatherings } = await useFetch<GatheringWithGuests[]>(
  '/api/supabase/gatherings', {
  query: {
    clubid: currentClub.value.id,
  },
  lazy: true
});

const clubPermissions = useClubPermissions();
const user = useSupabaseUser();

const loading = ref({
  gatheringId: 0,
  list: false,
  removeDialogYes: false,
})

definePageMeta({
  name: 'gatherings-public'
});

async function updateFilters() {
  loading.value.list = true;
  await updateGatherings();
  loading.value.list = false;
}

const gatheringsComputedValues = computed<{ [id: string]: GatheringComputedValue }>(() => {

  return gatherings.value?.reduce((acc: any, item) => {
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
  }, {}) || [];
});

interface gatheringsHash {
  [key: string]: GatheringWithGuests[]
}
const gatheringsHashedByDate = computed<gatheringsHash>(() => {
  if (gatherings.value?.length) {
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

function gatheringEdit(gathering: Gathering) {
  navigateTo('../item' + gathering.id);
}


const gatheringToRemove = ref<GatheringWithGuests | null>(null);
const removaGatheringModal = computed({
  get() {
    return !!gatheringToRemove.value
  },
  set(value) {
    if (!value) {
      gatheringToRemove.value = null;
    }
  }
})
function gatheringRemove(gathering: GatheringWithGuests) {
  gatheringToRemove.value = gathering;
  console.log(gatheringToRemove.value);
}

async function removeGatheringConfirmed() {
  if (!gatheringToRemove.value) return;

  loading.value.removeDialogYes = true;
  let res = await $fetch('/api/supabase/gathering-remove', {
    method: 'POST',
    body: {
      gathering_id: gatheringToRemove.value.id,
    }
  });
  gatheringToRemove.value = null;
  updateFilters();
  loading.value.removeDialogYes = false;
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



definePageMeta({
  name: 'gatherings-table',
  middleware: [
    async function (to, from) {
      if (to.name === 'gatherings-table') {
        return navigateTo(to.fullPath + '/list', { replace: true });
      }
    },
  ],
});
</script>

<style scoped>
.gathering-img {
  width: 180px;
  height: 180px;
}
</style>