<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
                {{ $t('add_game.add_game_title') }}
            </v-card-title>
            <v-card-text>
              <v-form @submit="searchForGame">
                <v-input :label="$t('add_game.enter_link')" v-model="gameToSearch"
                  placeholder="https://boardgamegeek.com/boardgame/169786/scythe">

                </v-input>
                <v-btn type="submit">
                  {{ $t('add_game.find_game') }}
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
          <v-card>
            <v-card-text v-if="gotBggData">
              {{ bggData.title }}
            </v-card-text>
            <v-card-actions>
              <v-btn @click="addGameToCollection">
                {{ $t('add_game.add_to_bd') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
const gameToSearch = ref('');
const gotBggData = ref(false);
const bggData = { title: 'abc' };
const loaders = ref({
  addingToBd: false
});

const stringIsBggLink = computed(() => {
  const regexResult = gameToSearch.value.match(/https:\/\/boardgamegeek\.com\/boardgame\/\d+\/[\w-]+/);
  return regexResult;
})

function searchForGame() {
  const ret = $fetch;
  gotBggData.value = true;

  const bggId = gameToSearch.value.match(/\d+/);
  console.log('fetch', bggId, stringIsBggLink.value);
}

const addGameToCollection = async () => {
  loaders.value.addingToBd = true;

  loaders.value.addingToBd = false;
}

</script>

<style scoped></style>