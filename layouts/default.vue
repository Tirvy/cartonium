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
      <v-btn v-for="page in pages">
        <v-icon>{{ page.icon }}</v-icon>
        <span>{{ page.title }}</span>
      </v-btn>
    </v-bottom-navigation>

  </v-app>
</template>

<script setup>
const route = useRoute();
const clubName = route.params.clubname;
definePageMeta({
  title: 'Arenochka'
})
const pages = [
    {
        title: 'club collection',
        path: `/clubs/${clubName}/collection`,
        icon: 'collection',
    },
    {
        title:'favorites',
        path: `/clubs/${clubName}/favorites`,
        icon: 'person',
    },
    {
        title: 'club info',
        path: `/clubs/${clubName}/informaion`,
        icon: 'informaion',
    },
    {
        title: 'bookings',
        path: `/clubs/${clubName}/bookings`,
        icon: 'table',
    },
    {
        title:'settings',
        path: `/clubs/${clubName}/settings`,
        icon: 'settings',
    }
];



import { useTheme } from 'vuetify'
const theme = useTheme()

function switchTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'myCustomWarnTheme' : 'myCustomDarkTheme'
}
</script>