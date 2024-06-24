<template>
  <v-main>
    <v-container>
      <v-row class="justify-space-between">
        <v-col>
          <v-card-title>
            Сборы на игры
          </v-card-title>
        </v-col>
        <v-col>
          <NuxtLink to="./gatherings" v-if="clubPermissions">
            К виду для админов
          </NuxtLink>
        </v-col>
      </v-row>
      <v-list>
        <template v-for="gathwd in gatheringsWithDates" :key="gathwd.date">
          <template v-if="gathwd.type === 'date'">
            <v-list-subheader>
              {{ gathwd.date }}
            </v-list-subheader>
          </template>

          <template v-else-if="gathwd.gathering">
            <v-card>
              <v-card-subtitle>
                [{{ gathwd.date }}]
              </v-card-subtitle>
              <v-card-title>
                {{ gathwd.gathering.gamebox ? gathwd.gathering.gamebox.title : gathwd.gathering.ownTitle }}
              </v-card-title>
              <v-card-text>
                ({{ gathwd.gathering.slotsFilled }}/{{ gathwd.gathering.guestsMax }})
                <p v-for="guest in gathwd.gathering.guests" :key="guest.imageUrl">
                  {{ guest.title }}
                  <span v-if="guest.additionalGuests">+ {{ guest.additionalGuests }}</span>
                </p>
              </v-card-text>
              <v-card-text>
                <td>{{ gathwd.gathering.commentOwner }}</td>
              </v-card-text>
              <v-card-actions>
                <v-btn>
                  Присоедениться
                </v-btn>
                <v-btn>
                  Покинуть сбор
                </v-btn>
                <v-btn>
                  Добавить гостей
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </template>
      </v-list>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import type { GatheringWithGuests, GatheringsWithDates } from '~/types/frontend'
import { useDate } from 'vuetify';
const dateAdapter = useDate()
const gatherings: Ref<GatheringWithGuests[]> = ref([]);
const currentClub: Ref<Club> = useState('club');
const clubPermissions = useClubPermissions();

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
</script>

<style scoped></style>