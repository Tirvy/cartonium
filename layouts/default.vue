<template>
  <v-app id="inspire">

    <v-app-bar dense>

      <template v-slot:prepend>
        <nuxt-link :to="adminLoginLink">
          <v-avatar color="yellow">A</v-avatar>
        </nuxt-link>
      </template>

      <v-app-bar-title>Ареночка</v-app-bar-title>
      <v-spacer></v-spacer>

      <template v-slot:append>
        <NuxtLink v-if="avatar.show" :to="profileLink">
          <v-avatar :image="avatar.pictureUrl" color="yellow">
            <v-img :alt="avatar.name" v-if="avatar.pictureUrl" :src="avatar.pictureUrl"></v-img>
            <template v-else>
              {{ avatar.initials }}
            </template>
          </v-avatar>
        </NuxtLink>

        <commonTelegramLoginButton v-else />
      </template>
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

const profileLink = `/clubs/${clubName.value}/profile`;
const adminLoginLink = `/clubs/${clubName.value}/admin-login`;

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
    title: 'Сборы',
    path: `/clubs/${clubName.value}/gatherings`,
    icon: 'mdi-table-furniture',
  },
  {
    title: 'Настройки клуба',
    path: `/clubs/${clubName.value}/settings`,
    icon: 'mdi-cog-outline',
    permissions: true,
  },
  // {
  //   title: 'Профиль',
  //   path: `/clubs/${clubName.value}/profile`,
  //   icon: 'mdi-account',
  // }
];

const clubPermissions = useClubPermissions();
const pagesList = computed(() => {
  return pages.filter(item => !item.permissions || clubPermissions)
})


import { useTheme } from 'vuetify'
const theme = useTheme()

const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
  theme.global.name.value = storedTheme;
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  theme.global.name.value = 'myCustomDarkTheme';
}

// setting up user avatar
const user = useSupabaseUser();

const avatar = computed(() => {
  return {
    show: !!user.value,
    pictureUrl: user.value?.user_metadata?.avatar_url,
    name: user.value?.user_metadata.first_name,
    initials: user.value?.user_metadata?.full_name.split(' ').map((item: string) => item[0].toUpperCase()).join(''),
  }
});

</script>