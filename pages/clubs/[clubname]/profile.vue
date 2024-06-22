<template>
  <v-main>
    <v-container class="h-100">
      <template v-if="user">
        <v-row>
          <v-col>
            <v-switch v-model="isDarkTheme" label="Включить ночную тему"></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-switch v-model="forcePermissionsAdmin" label="force admin"></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="logout">
              Logout
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <v-col v-else-if="!user" class="d-flex justify-center">
        <common-login></common-login>
      </v-col>
    </v-container>
  </v-main>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()

const logout = async () => {
  await client.auth.signOut()
}

import { useTheme } from 'vuetify'
const theme = useTheme()

const isDarkTheme = computed({
  get() {
    return theme.global.current.value.dark
  },
  set(value) {
    const newTheme = !value ? 'themeInitialLight' : 'themeInitialDark'
    theme.global.name.value = newTheme;
    localStorage.setItem('theme', newTheme);
  }
})

const localIsAdminValue = ref(localStorage.getItem('forcePermissions'));
if (!localIsAdminValue) {
  localIsAdminValue.value = useClubPermissions();
}
const forcePermissionsAdmin = computed({
  get() {
    return localIsAdminValue.value != 'guest';
  },
  set(value) {
    const newValue = value ? 'admin' : 'guest';
    console.log(value, newValue);
    localStorage.setItem('forcePermissions', newValue);
    localIsAdminValue.value = newValue;
  }
})
</script>