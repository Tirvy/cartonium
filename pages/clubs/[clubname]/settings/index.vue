<template>
  <v-main>
    <v-container>
      <v-sheet>
        <v-list>
          <v-list-item>
            <NuxtLink to="./settings/themes">
              Настройка цветовой темы
            </NuxtLink>
          </v-list-item>
          <v-list-item>
            <NuxtLink to="./settings/tables">
              Настройка столов в клубе
            </NuxtLink>
          </v-list-item>
        </v-list>
        <v-card>
          <v-card-title>
            Общие настройки
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-switch label="Разрешить бронировать" color="primary" v-model="guestCanReserve"></v-switch>
              </v-list-item>
              <v-list-item>
                <v-switch label="Разрешить создавать свои игры" color="primary" v-model="guestCanGatherOwn"></v-switch>
              </v-list-item>
              <v-list-item>
                <v-switch label="Поиск в коллекции по рейтингу" color="primary" v-model="collectionSearchRating"></v-switch>
              </v-list-item>
              <v-list-item>
                <v-switch label="Поиск в коллекции по кол-ву игроков" color="primary" v-model="collectionSearchPlayers"></v-switch>
              </v-list-item>
              <v-list-item>
                <v-switch label="Поиск в коллекции по длительности" color="primary" v-model="collectionSearchDuration"></v-switch>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="saveChanges">Сохранить изменения</v-btn>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>

const currentClub: Ref<Club> = useState('club');

const guestCanReserve = ref(currentClub.value.guestCanReserve ?? false);
const guestCanGatherOwn = ref(currentClub.value.guestCanGatherOwn ?? false);
const collectionSearchRating = ref(currentClub.value.collectionSearchRating ?? true);
const collectionSearchPlayers = ref(currentClub.value.collectionSearchPlayers ?? true);
const collectionSearchDuration = ref(currentClub.value.collectionSearchDuration ?? true);

async function saveChanges() {

  const response = await useFetch('/api/supabase/club-settings', {
    method: 'POST',
    query: {
      clubid: currentClub.value.id,
    },
    body: {
      club_id: currentClub.value.id,
      guest_can_reserve: guestCanReserve.value,
      guest_can_gather_own: guestCanGatherOwn.value,
      themes: currentClub.value.themes,
      avatar_url: currentClub.value.avatarUrl,
      collection_search_rating: collectionSearchRating.value,
      collection_search_players: collectionSearchPlayers.value,
      collection_search_duration: collectionSearchDuration.value,
    }
  });

  if (response.data) {
    currentClub.value.guestCanGatherOwn = response.data.value.guest_can_gather_own;
    currentClub.value.guestCanReserve = response.data.value.guest_can_reserve;
    currentClub.value.collectionSearchRating = response.data.value.collection_search_rating;
    currentClub.value.collectionSearchPlayers = response.data.value.collection_search_players;
    currentClub.value.collectionSearchDuration = response.data.value.collection_search_duration;
  }
}
</script>

<style scoped></style>