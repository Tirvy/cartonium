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
      <v-btn v-for="page in pagesList" :to="page.path">
        <v-icon :icon="page.icon"></v-icon>
        <span>{{ page.title }}</span>
      </v-btn>
    </v-bottom-navigation>

  </v-app>
</template>

<script setup lang="ts">

const redirectPath = useCookie('sb-redirect-path');
const lastClub = computed(() => {
  const path = redirectPath.value || "";
  const splitted = path.split('/');
  if (splitted.length > 2) {
    return splitted[2];
  }
  return ''
});

const route = useRoute();
const clubName = computed(() => {
  return route.params.clubname || lastClub.value || 'emarena';
});

let pages = [
  {
    title: 'Коллекция',
    path: `/clubs/${clubName.value}/collection`,
    icon: 'mdi-list-box',
  },
  {
    title: 'О клубе',
    path: `/clubs/${clubName.value}/information/public`,
    icon: 'mdi-information',
  },
  {
    title: 'Брони',
    path: `/clubs/${clubName.value}/gatherings`,
    icon: 'mdi-table-furniture',
  },
  {
    title: 'Настройки клуба',
    path: `/clubs/${clubName.value}/settings`,
    icon: 'mdi-cog-outline',
    permissions: true,
  },
  {
    title: 'Профиль',
    path: `/clubs/${clubName.value}/profile`,
    icon: 'mdi-account',
  }
];

const clubPermissions = useClubPermissions();
const pagesList = computed(() => {
  return pages.filter(item => !item.permissions || clubPermissions )
})

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