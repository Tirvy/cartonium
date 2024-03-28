<template>
  <v-app id="inspire">

    <v-app-bar dense>

      <template v-slot:prepend>
        <v-avatar color="yellow">A</v-avatar>
      </template>

      <v-app-bar-title>Ареночка</v-app-bar-title>
      <v-spacer></v-spacer>
      <div class="flex">
        <v-switch label="isAdmin" v-model="permissionsOverride"></v-switch>
      </div>
      <div v-if="user">
        user: {{ user.email }}
      </div>
      <v-btn @click="switchTheme">
        <v-icon icon="mdi-theme-light-dark"></v-icon>
      </v-btn>
    </v-app-bar>

    <slot />

    <v-bottom-navigation grow color="grey" height="44">
      <v-btn v-for="page in pages" :to="page.path">
        <v-icon :icon="page.icon"></v-icon>
        <span>{{ page.title }}</span>
      </v-btn>
    </v-bottom-navigation>

  </v-app>
</template>

<script setup lang="ts">
const route = useRoute();
const clubName = route.params.clubname;
const permissionsOverride = useState('permissionsOverride');
permissionsOverride.value = false;

const pages = [
  {
    title: 'Коллекция',
    path: `/clubs/${clubName}/collection`,
    icon: 'mdi-list-box',
  },
  {
    title: 'О клубе',
    path: `/clubs/${clubName}/information/public`,
    icon: 'mdi-information',
  },
  {
    title: 'Брони',
    path: `/clubs/${clubName}/gatherings`,
    icon: 'mdi-table-furniture',
  },
  {
    title: 'Профиль',
    path: `/profile`,
    icon: 'mdi-account',
  }
];



import { useTheme } from 'vuetify'
const theme = useTheme()

function switchTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'myCustomWarnTheme' : 'myCustomDarkTheme'
}

const user = useSupabaseUser()

</script>