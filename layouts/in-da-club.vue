<template>
  <v-app id="inspire">

    <v-app-bar dense class="px-2">

      <template v-slot:prepend>
        <nuxt-link :to="clubSettings">
          <v-avatar color="yellow">
            <v-img :src="clubAvatar.pictureUrl"></v-img>
          </v-avatar>
        </nuxt-link>
      </template>

      <v-app-bar-title>{{ currentClub?.title }}</v-app-bar-title>

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

    <v-bottom-navigation grow color="grey" height="44" fixed>
      <v-btn v-for="page in pagesList" :to="page.path">
        <v-icon :icon="page.icon"></v-icon>
        <span>{{ page.title }}</span>
      </v-btn>
    </v-bottom-navigation>

    <v-snackbar v-if="showAdminMobileWarning" :model-value="true" color="info" order="10" variant="flat" location="top"
      timeout="1500" timer="true" z-index="999">
      В мобильной версии админские разделы ограничены
    </v-snackbar>

    <pages-cookie-asker :avatar="clubAvatar.pictureUrl" />

  </v-app>
</template>

<script setup lang="ts">

const redirectPath = useCookie('sb-redirect-path');
const currentClub: Ref<Club> = useState('club');

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
  return route.params.clubname || lastClub.value || 'terra';
});

const profileLink = `/clubs/${clubName.value}/profile`;
const adminLoginLink = `/clubs/${clubName.value}/admin-login`;
const clubSettings = `/clubs/${clubName.value}/settings`;

let pages = [
  {
    title: 'Сборы',
    path: `/clubs/${clubName.value}/gatherings/table`,
    icon: 'mdi-table-furniture',
  },
  {
    title: 'О клубе',
    path: `/clubs/${clubName.value}/information/public`,
    icon: 'mdi-information',
  },
  {
    title: 'Коллекция',
    path: `/clubs/${clubName.value}/collection`,
    icon: 'mdi-list-box',
  },
  {
    title: 'Настройки клуба',
    path: `/clubs/${clubName.value}/settings`,
    icon: 'mdi-cog-outline',
    permissions: true,
    mobile: false,
  },
  {
    title: 'Профиль',
    path: `/clubs/${clubName.value}/profile`,
    icon: 'mdi-account',
    mobile: false,
  }
];

const { mobile } = useDisplay();
const clubPermissions = useClubPermissions();
const pagesList = computed(() => {
  return pages.filter(item => {
    if (item.permissions && !clubPermissions.value) return false;
    if (mobile.value && item.mobile === false) return false;
    return true;
  })
})

const showAdminMobileWarning = computed(() => {
  return mobile.value && clubPermissions.value;
});


import { useDisplay, useTheme } from 'vuetify'
const theme = useTheme()

onBeforeMount(() => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme && theme.themes.value[storedTheme]) {
    theme.global.name.value = storedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.global.name.value = 'themeInitialDark';
  }
});

// club avatar
const clubAvatar = computed(() => {
  return {
    pictureUrl: `https://impmukiwmihnyyzvyjyp.supabase.co/storage/v1/object/public/club-avatars/${clubName.value}.png`,
  }
});

// setting up user avatar
const user = useSupabaseUser();

const initials = computed(() => {
  let source = user.value?.user_metadata?.full_name || user.value?.user_metadata?.name;

  if (source) {
    return source.split(' ').map((item: string) => item[0].toUpperCase()).join('');
  }

  return user.value?.email?.split('@').map(str => str[0]).join('@').toUpperCase();
})

const avatar = computed(() => {
  return {
    show: !!user.value,
    pictureUrl: user.value?.user_metadata?.avatar_url,
    name: user.value?.user_metadata.first_name,
    initials: initials.value,
  }
});

</script>