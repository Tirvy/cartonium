<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col class="d-flex justify-center">
        {{ $t('landing.welcome') }}
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col class="d-flex justify-center" cols="8">
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
      <v-col class="d-flex justify-center" cols="8">
        {{ $t('landing.players_who') }}
      </v-col>
      <v-spacer cols="2"></v-spacer>
    </v-row>
    <v-row>
      <v-spacer cols="4"></v-spacer>
      <v-col class="d-flex justify-center" cols="8">
        {{ $t('landing.players_when') }}
      </v-col>
    </v-row>
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
