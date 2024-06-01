<template>
  <v-main>
    <v-container class="h-100">
      <v-row>
        <v-col>
          Переключить тему: 
          <v-btn @click="switchTheme">
            <v-icon icon="mdi-theme-light-dark"></v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="logout">
            Logout
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/')
}

import { useTheme } from 'vuetify'
const theme = useTheme()

function switchTheme() {
  const newTheme = theme.global.current.value.dark ? 'myCustomWarnTheme' : 'myCustomDarkTheme';
  theme.global.name.value = theme.global.current.value.dark ? 'myCustomWarnTheme' : 'myCustomDarkTheme';
  localStorage.setItem('theme', newTheme);
}
</script>