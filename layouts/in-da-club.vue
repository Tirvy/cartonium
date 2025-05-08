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

      <template v-slot:title>
        <v-app-bar-title>{{ currentClub?.title }}</v-app-bar-title>
      </template>

      <template v-slot:default>

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props">
              {{ locale }}
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(item, index) in locales" :key="index" :value="index" @click="setLocale(item.code)">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

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
        <span>{{ pagesTitles[page.alias] }}</span>
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


// locales
const { locales, locale, setLocale, t } = useI18n();

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

const pagesTitles = computed<{[k: string]: string}>(() => {
  return {
    gatherings: t('nav.gatherings'),
    clubInfo: t('nav.club_info'),
    collection: t('nav.collection'),
    clubSettings: t('nav.club_settings'),
    profile: t('nav.profile'),
  }
});

let pages = [
  {
    alias: 'gatherings',
    path: `/clubs/${clubName.value}/gatherings/table`,
    icon: 'mdi-table-furniture',
  },
  {
    alias: 'clubInfo',
    path: `/clubs/${clubName.value}/information/public`,
    icon: 'mdi-information',
  },
  {
    alias: 'collection',
    path: `/clubs/${clubName.value}/collection`,
    icon: 'mdi-list-box',
  },
  {
    alias: 'clubSettings',
    path: `/clubs/${clubName.value}/settings`,
    icon: 'mdi-cog-outline',
    permissions: true,
    mobile: false,
  },
  {
    alias: 'profile',
    path: `/clubs/${clubName.value}/profile`,
    icon: 'mdi-account',
    mobile: false,
  }
];

const { mobile } = useDisplay();
const { clubPermissions } = useClubPermissions();
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
const storedThemeCookie = useCookie('theme');
if (storedThemeCookie.value && theme.themes.value[storedThemeCookie.value]) {
  theme.global.name.value = storedThemeCookie.value;
}
onMounted(() => {
  if (!storedThemeCookie.value && window.matchMedia) {
    let newTheme = 'themeInitialLight'
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      newTheme = 'themeInitialDark'
    }
    theme.global.name.value = newTheme;
    storedThemeCookie.value = newTheme;
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