<template>
  <v-container>
    <v-container fluid class="fill-height">
      <v-row>
        <v-col class="d-flex justify-center">
          <v-container>
            <v-row>
              <v-col class="d-flex justify-center">
                <h1>{{ $t('landing.welcome') }}</h1>
              </v-col>
            </v-row>
            <v-row class="justify-space-around">
              <v-col class="d-flex justify-center">
                <v-card>
                  <v-card-title>
                    {{ $t('landing.welcome_players') }}
                  </v-card-title>
                  <v-card-actions class="d-flex justify-center">
                    <v-icon>mdi-arrow-down-bold-outline</v-icon>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col class="d-flex justify-center">
                <v-card>
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
    </v-container>
    <v-spacer class="my-10"></v-spacer>
    <v-container>
      <v-card>
        <v-card-title>
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
    </v-container>
    <v-spacer class="my-10"></v-spacer>
    <v-container>
      <v-card>
        <v-card-title>
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
            <v-col>
              <v-card>
                <v-card-text>
                  {{ $t('landing.clubs_gatherings') }}
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card>
                <v-card-text>
                  {{ $t('landing.clubs_statistics') }}
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="justify-center">
            <v-col class="d-flex justify-center">
              {{ $t('landing.clubs_bot') }}
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
    <v-footer>
      smth i dont know well
    </v-footer>
  </v-container>
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
</script>

<style scoped></style>
