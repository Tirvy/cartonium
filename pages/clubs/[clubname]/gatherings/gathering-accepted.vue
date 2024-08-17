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
                    {{ dateAdapter.format(lastGathering.startDate, 'fullDateTime') }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="lastGatheringName">
                  <template v-slot:prepend>
                    <v-avatar>
                      <v-icon color="info">mdi-hexagon-multiple-outline</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title>
                    Что собираете
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ lastGatheringName }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="lastGathering.guestsMax">
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

                <v-list-item v-if="lastGathering.contact">

                  <template v-slot:prepend>
                    <v-avatar>
                      <v-icon color="info">mdi-cellphone-message</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title>
                    Контакт обратной связи
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ lastGathering.contact }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="lastGathering.commentOwner">

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
                  <v-list-item-subtitle>
                    Информацию можно подглянуть на вкладке "о клубе"
                  </v-list-item-subtitle>
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
  </v-main>

</template>

<script lang="ts" setup>
const currentClub: Ref<Club> = useState('club');

import { useDate } from 'vuetify';
const dateAdapter = useDate()

const lastGathering = useState('lastGathering') as Ref<Gathering>;
const lastGatheringName = useState('lastGatheringName') as Ref<string>;

if (!lastGathering.value) {
  navigateTo('./item');
}

console.log(lastGathering.value);

</script>

<style scoped></style>