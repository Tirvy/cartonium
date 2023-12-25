<template>
  <v-app id="inspire">

    <v-app-bar dense>

      <template v-slot:prepend>
        <v-avatar color="yellow">A</v-avatar>
      </template>

      <v-app-bar-title>Ареночка</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn @click="switchTheme">
        theme-icon
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

<script setup>
const route = useRoute();
const clubName = route.params.clubname;
const pages = [
    {
        title: 'club collection',
        path: `/clubs/${clubName}/collection`,
        icon: 'mdi-list-box',
    },
    {
        title: 'add games',
        path: `/clubs/${clubName}/add-games`,
        icon: 'mdi-add',
    },
    {
        title:'favorites',
        path: `/clubs/favorites`,
        icon: 'mdi-heart',
    },
    {
        title: 'club info',
        path: `/clubs/${clubName}/informaion`,
        icon: 'mdi-information',
    },
    {
        title: 'bookings',
        path: `/clubs/${clubName}/bookings`,
        icon: 'mdi-table-furniture',
    },
    {
        title:'settings',
        path: `/settings`,
        icon: 'mdi-cog',
    }
];



import { useTheme } from 'vuetify'
const theme = useTheme()

function switchTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'myCustomWarnTheme' : 'myCustomDarkTheme'
}
</script>