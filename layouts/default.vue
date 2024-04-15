<template>
  <v-app id="inspire">

    <v-app-bar dense>

      <template v-slot:prepend>
        <nuxt-link :to="pages[1].path">
          <v-avatar color="yellow">A</v-avatar>
        </nuxt-link>
      </template>

      <v-app-bar-title>Ареночка</v-app-bar-title>
      <v-spacer></v-spacer>
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


const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
  theme.global.name.value = storedTheme;
}

function switchTheme() {
  const newTheme = theme.global.current.value.dark ? 'myCustomWarnTheme' : 'myCustomDarkTheme';
  theme.global.name.value = theme.global.current.value.dark ? 'myCustomWarnTheme' : 'myCustomDarkTheme';
  localStorage.setItem('theme', newTheme);
}

const user = useSupabaseUser()

</script>