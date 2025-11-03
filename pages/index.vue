<template>
  <v-main>
    <v-container fluid class="bg-purple-lighten-5 banner-container align-content-center">
      <v-spacer class="my-20"></v-spacer>
      <v-row>
        <v-col class="d-flex justify-center">
          <v-container>
            <v-row>
              <v-col class="d-flex justify-center text-center text-h4">
                {{ $t('landing.welcome') }}
              </v-col>
            </v-row>
            <v-row class="justify-space-around">
              <v-col class="d-flex justify-center">
                <v-card @click="scrollTo('#players')">
                  <v-card-title>
                    {{ $t('landing.welcome_players') }}
                  </v-card-title>
                  <v-card-actions class="d-flex justify-center">
                    <v-icon>mdi-arrow-down-bold-outline</v-icon>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col class="d-flex justify-center">
                <v-card @click="scrollTo('#clubs')">
                  <v-card-title>
                    {{ $t('landing.welcome_clubs') }}
                  </v-card-title>
                  <v-card-actions class="d-flex justify-center">
                    <v-icon>mdi-arrow-down-bold</v-icon>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
      <v-spacer class="my-10"></v-spacer>
    </v-container>
    <v-container fluid class="bg-green-lighten-5" id="players">
      <v-container>
        <v-spacer class="my-10"></v-spacer>
        <v-card elevation="0" class="bg-transparent">
          <v-card-title class="text-center mb-5 text-h4 text-pre-wrap">
            {{ $t('landing.players_title') }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="8">
                <v-card>
                  <v-card-title>
                    {{ $t('landing.players_where_title') }}
                  </v-card-title>
                  <v-card-text>
                    {{ $t('landing.players_where_text') }}
                  </v-card-text>
                </v-card>
              </v-col>
              <v-spacer cols="4"></v-spacer>
            </v-row>
            <v-row>
              <v-spacer cols="2"></v-spacer>
              <v-col cols="8">
                <v-card>
                  <v-card-title>
                    {{ $t('landing.players_who_title') }}
                  </v-card-title>
                  <v-card-text>
                    {{ $t('landing.players_who_text') }}
                  </v-card-text>
                </v-card>
              </v-col>
              <v-spacer cols="2"></v-spacer>
            </v-row>
            <v-row>
              <v-spacer cols="4"></v-spacer>
              <v-col cols="8">
                <v-card>
                  <v-card-title>
                    {{ $t('landing.players_when_title') }}
                  </v-card-title>
                  <v-card-text>
                    {{ $t('landing.players_when_text') }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-spacer class="my-10"></v-spacer>
      </v-container>
    </v-container>
    <v-container fluid class="bg-orange-lighten-5" id="clubs">
      <v-container>
        <v-spacer class="my-10"></v-spacer>
        <v-card elevation="0" class="bg-transparent">
          <v-card-title class="text-center mb-5 text-h4 text-pre-wrap">
            {{ $t('landing.clubs_title') }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-card>
                  <v-card-text>
                    {{ $t('landing.clubs_collection') }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-card>
                  <v-card-text>
                    {{ $t('landing.clubs_gatherings') }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-card>
                  <v-card-text>
                    {{ $t('landing.clubs_statistics') }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-col class="d-flex justify-center flex-column direction-column text-center align-center">
                <div>
                  {{ $t('landing.clubs_join_connect') }}
                </div>
                <v-btn color="blue" rounded variant="flat" class="ml-2" :href="'https://t.me/tirvy'" target="_blank">
                  {{ $t('landing.clubs_join_link') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
      <v-spacer class="my-10"></v-spacer>
    </v-container>
    <v-footer class="bg-grey">
      smth i dont know well
    </v-footer>
  </v-main>
</template>

<script setup lang="ts">

const user = useSupabaseUser()
const defaultPage = useDefaultPage();

watch(user, () => {
  if (user.value) {
    return navigateTo(defaultPage)
  }
}, { immediate: true })

definePageMeta({
  name: 'root-index',
});

const goTo = useGoTo();
function scrollTo(id: string) {
  goTo(id, { offset: -64 });
}
</script>

<style scoped>
.banner-container {
  min-height: calc(100vh - 64px);
}
</style>