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
          <v-card>
            <div class="d-flex flex-no-wrap justify-start ">
              <v-avatar class="ma-3" size="180" rounded="0">
                <v-img :cover="false" height="180" :src="gathwd.gathering.gamebox?.photoUrl"></v-img>
              </v-avatar>
              <div>
                <v-card-title>
                  {{ gathwd.gathering.gamebox.title || gathwd.gathering.ownTitle }} ({{ gathwd.gathering.slotsFilled }}/{{ gathwd.gathering.guestsMax }})
                </v-card-title>
                <v-card-subtitle>
                  [{{ gathwd.date }}]
                </v-card-subtitle>
                <v-card-text>
                  <p v-for="guest in gathwd.gathering.guests" :key="guest.imageUrl">
                    <user-avatar :value="guest"></user-avatar>
                    {{ guest.title }}
                    <span v-if="guest.totalGuests > 1">+ {{ guest.totalGuests - 1 }}</span>
                  </p>
                </v-card-text>
                <v-card-text>
                  <td>{{ gathwd.gathering.commentOwner }}</td>
                </v-card-text>
              </div>
            </div>
            <v-card-actions v-if="user?.id">
              <v-btn @click="guestSet(gathwd.gathering.id, 1)"
                :disabled="!gatheringsComputedValues[gathwd.gathering.id].canJoin">
                Присоедениться
              </v-btn>
              <!-- <v-btn v-if="false" @click="showDialogGuests(gathwd.gathering)" :disabled="!gatheringsComputedValues[gathwd.gathering.id].canAddGuests">
                Добавить гостей
              </v-btn> -->
              <v-btn @click="guestSet(gathwd.gathering.id, 0)"
                :disabled="!gatheringsComputedValues[gathwd.gathering.id].canLeave">
                Покинуть сбор
              </v-btn>
            </v-card-actions>
          </v-card>
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
  </v-main>

</template>

<script lang="ts" setup>
import type { Gathering, GatheringWithGuests, GatheringsWithDates } from '~/types/frontend'
import { useDate } from 'vuetify';
const dateAdapter = useDate()
const gatherings: Ref<GatheringWithGuests[]> = ref([]);
const currentClub: Ref<Club> = useState('club');
const clubPermissions = useClubPermissions();
const user = useSupabaseUser();

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

const gatheringsComputedValues = computed(() => {

  return gatherings.value.reduce((acc: any, item) => {
    const userIsInThisGathering = item.guests.some(guest => guest.id === user.value?.id);
    const notMax = item.guestsMax > item.slotsFilled;
    acc[item.id] = {
      canJoin: !userIsInThisGathering && notMax,
      canLeave: userIsInThisGathering,
      canAddGuests: userIsInThisGathering && notMax
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
  const keys = Object.keys(gatheringsHashedByDate.value);
  const ret: GatheringsWithDates[] = [];
  keys.forEach(key => {
    ret.push({
      type: 'date',
      date: dateAdapter.format(dateAdapter.date(key), 'normalDateWithWeekday'),
      gathering: undefined,
    });

    gatheringsHashedByDate.value[key].forEach(gathering => {
      ret.push({
        type: 'gathering',
        date: dateAdapter.format(dateAdapter.date(gathering.startDate), 'fullTime'),
        gathering: gathering
      });
    })
  })
  return ret;
});

async function guestSet(gatheringId: number, number: number) {
  const data: any = await $fetch('/api/supabase/gatherings-set-guest', {
    method: 'POST',
    body: {
      gathering_id: gatheringId,
      guest_id: user.value?.id,
      number,
    }
  });

  if (!data.error) {
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

function showDialogGuests(gathering: Gathering) {

}
</script>

<style scoped>
.gathering-img {
  width: 180px;
  height: 180px;
}
</style>