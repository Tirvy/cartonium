<template>
  <v-app id="inspire">

    <v-app-bar dense>

      <template v-slot:prepend>
        <v-avatar @click="logUser" color="yellow">A</v-avatar>
      </template>

      <v-app-bar-title>Ареночка</v-app-bar-title>
      <v-spacer></v-spacer>
      <div v-if="user">
        {{ user.email }}
      </div>
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
    title: 'collection',
    path: `/clubs/${clubName}/collection`,
    icon: 'mdi-list-box',
  },
  {
    title: 'info',
    path: `/clubs/${clubName}/information`,
    icon: 'mdi-information',
  },
  {
    title: 'bookings',
    path: `/clubs/${clubName}/bookings`,
    icon: 'mdi-table-furniture',
  },
  {
    title: 'profile',
    path: `/profile`,
    icon: 'mdi-cog',
  }
];



import { useTheme } from 'vuetify'
import useClubPermissions from '@/composibles/useClubPermissions';
const theme = useTheme()

function switchTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'myCustomWarnTheme' : 'myCustomDarkTheme'
}

const user = useSupabaseUser()
const permissions = useClubPermissions();

await callOnce(async () => {
  const clubs = await $fetch('/api/supabase/my-clubs-permissions', {
    query: {
      userid: user.value.id,
    }
  });
  permissions.value = clubs;
})

function logUser() {
  console.log(permissions.value)
}

</script>