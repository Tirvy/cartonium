<template>
  <v-main>
    <v-container class="h-100">
      <template v-if="user">
        <v-row>
          <v-col>
            <v-btn :to="{ name: 'schedules' }" variant="plain" v-bind:append-icon="'mdi-arrow-right-thin'">
              График свободного времени</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-switch v-model="isDarkTheme" label="Включить ночную тему"></v-switch>
          </v-col>
        </v-row>
        <v-row v-if="false">
          <v-col>
            <v-switch v-model="forcePermissionsAdmin" color="primary" label="force admin"></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="logout">
              Logout
            </v-btn>
          </v-col>
        </v-row>
      </template>

      <template v-else-if="!user">
        <v-row>
          <v-col class="d-flex justify-center">
            <v-card-title>
              Логин для админов
            </v-card-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-center">
            <common-login></common-login>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </v-main>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const { update: updateUserPermissions } = useClubPermissions();

const logout = async () => {
  await client.auth.signOut();
  updateUserPermissions();
}

import { useTheme } from 'vuetify'
const theme = useTheme()

const isDarkTheme = computed({
  get() {
    return theme.global.current.value.dark
  },
  set(value) {
    const newTheme = !value ? 'themeInitialLight' : 'themeInitialDark'
    theme.global.name.value = newTheme;
    localStorage.setItem('theme', newTheme);
  }
})
</script>