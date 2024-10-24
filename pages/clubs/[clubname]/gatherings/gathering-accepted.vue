<template>
  <v-main><v-container fill-height fluid>
      <v-row class="justify-center align-center">
        <v-col style="max-width: 600px;">
          <v-card>
            <v-card-title class="bg-surface">
              Сбор создан
            </v-card-title>
            <v-card-text>
              <v-list lines="two">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-avatar>
                      <v-icon color="info">mdi-calendar</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title>
                    Дата и время
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ dateAdapter.format(lastGathering?.startDate, 'fullDateTime') }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="lastGatheringName">

                  <template v-slot:prepend>
                    <v-avatar>
                      <v-icon color="info">mdi-gift-open-outline</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title>
                    Что собираете
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ lastGatheringName }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="lastGathering?.guestsMax">

                  <template v-slot:prepend>
                    <v-avatar>
                      <v-icon color="info">mdi-account-group-outline</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title>
                    Сколько собираете людей
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ lastGathering.guestsMax }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>

                  <template v-slot:prepend>
                    <v-avatar>
                      <v-icon color="info">mdi-cellphone-sound</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title>
                    Ссылка на сбор
                  </v-list-item-title>
                  <v-list-item-subtitle class="cursor-pointer" @click="copyLink">
                    <div class="text-caption pa-2 bg-grey-lighten-2 d-flex justify-space-between">
                      <div style="max-width: 90%;">
                        {{ generatedLink }}
                      </div>
                      <div>
                        <v-icon>mdi-content-copy</v-icon>
                      </div>
                    </div>
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="lastGathering?.commentOwner">

                  <template v-slot:prepend>
                    <v-avatar>
                      <v-icon color="info">mdi-note</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title>
                    Комментарий
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ lastGathering.commentOwner }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-text v-if="currentClub.reservationLinks.length || currentClub.reservationPhones.length">
              <v-list>
                <v-list-item>
                  <v-list-item-title>
                    Забронировать стол можно так
                  </v-list-item-title>
                </v-list-item>

                <template v-if="currentClub.reservationLinks.length">
                  <v-list-item>
                    <v-list-item-subtitle>
                      По ссылк{{ currentClub.reservationPhones.length > 1 ? 'ам' : 'е' }}
                    </v-list-item-subtitle>
                    <nuxt-link v-for="item in currentClub.reservationLinks" :to="item">{{ item }}</nuxt-link>
                  </v-list-item>
                </template>

                <template v-if="currentClub.reservationPhones.length">
                  <v-list-item>
                    <v-list-item-subtitle>
                      По телефон{{ currentClub.reservationPhones.length > 1 ? 'ам' : 'у' }}
                    </v-list-item-subtitle>
                    <nuxt-link v-for="item in currentClub.reservationPhones" :to="`tel:${item}`">+{{ item }}</nuxt-link>
                  </v-list-item>
                </template>
                <v-list-item>
                  <p>
                    Информацию можно подглянуть на вкладке "о клубе" внизу страницы
                  </p>
                </v-list-item>
              </v-list>

              <template></template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="justify-center align-center">
        <v-col class="d-flex justify-center">
          <v-btn @click="navigateTo('./table')">
            Обратно к списку
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="snackbar" timeout="3000">
      Ссылка скопирована
    </v-snackbar>
  </v-main>

</template>

<script lang="ts" setup>
const currentClub = useState<Club>('club');
const router = useRouter();

import { useDate } from 'vuetify';
const dateAdapter = useDate()

const lastGathering = useState<Gathering | undefined>('lastGathering');
const lastGatheringName = useState<string>('lastGatheringName');

definePageMeta({
  middleware: [
    () => {
      const lastGathering = useState<Gathering | undefined>('lastGathering');
      console.log(lastGathering.value?.id);
      if (!lastGathering.value?.id) {
        return navigateTo({name: 'gatherings-table-list'});
      }
    }
  ]
})

onBeforeRouteLeave(() => {
  lastGathering.value = undefined;
  lastGatheringName.value = '';
})

const snackbar = ref(false);
const generatedLink = computed(() => {
  const linkedItemRoute = router.getRoutes().find(item => item.name === 'gatherings-linked-item');
  const linkedRoute = router.resolve({ ...linkedItemRoute, params: { id: lastGathering.value?.id } });
  const absoluteURL = new URL(linkedRoute.href, window.location.origin).href;
  return absoluteURL;
});
function copyLink() {
  navigator.clipboard.writeText(generatedLink.value);
  snackbar.value = true;
}
</script>

<style scoped></style>