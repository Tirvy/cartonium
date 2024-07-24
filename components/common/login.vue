<template>
  <v-card class="login-card">
    <template v-if="loginWithEmailAvailable">
      <v-card-title>
        login with email
      </v-card-title>
      <v-card-actions>
        <v-form class="w-100" @submit.prevent="signInWithEmail" v-model="loginFormIsValid">
          <v-text-field v-model="loginEmail" :rules="[required]" label="email"
            autocomplete="login email"></v-text-field>
          <v-text-field v-model="loginPassword" :rules="[required]" label="password" autocomplete="current-password"
            :append-inner-icon="show.passwordLogin ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show.passwordLogin ? 'text' : 'password'"
            @click:append-inner="show.passwordLogin = !show.passwordLogin"></v-text-field>
          <v-btn :loading="loaders.loginEmail" type="submit">login</v-btn>
        </v-form>
      </v-card-actions>
    </template>

    <template v-if="loginWithTelegramAvailable">
      <v-card-actions>
        <commonTelegramLoginButton @auth="authByTelegram" />
      </v-card-actions>
    </template>

    <template v-if="loginWithKeycloakAvailable">
      <v-card-actions>
        <v-btn @click="signInWithKeycloak">keycloak</v-btn>
      </v-card-actions>
    </template>

    <template v-if="loginWithProviderAvailable">
      <v-card-title>
        login with providers
      </v-card-title>
      <v-card-actions>
        <v-btn icon="mdi-github" @click="signInWithProvider('github')"></v-btn>
        <v-btn icon="mdi-google" @click="signInWithProvider('google')"></v-btn>
        <v-btn icon="mdi-facebook" @click="signInWithProvider('facebook')"></v-btn>
        <v-btn icon="mdi-discord" @click="signInWithProvider('discord')">d</v-btn>
      </v-card-actions>
    </template>

    <template v-if="guestAvailable">
      <v-card-actions>
        <v-btn @click="singInAsGuest" block variant="outlined">
          Войти как гость
        </v-btn>
      </v-card-actions>
    </template>


    <template v-if="registrationAvailable">
      <v-divider />
      <v-card-title>
        signup with email
      </v-card-title>
      <v-card-actions>
        <v-form class="w-100">
          <v-text-field v-model="signupEmail" label="email"></v-text-field>
          <v-text-field v-model="signupPassword" label="password"></v-text-field>
          <v-btn @click="signUpNewUser">sign up</v-btn>
        </v-form>
      </v-card-actions>

    </template>
  </v-card>

  <v-snackbar v-model="snackbar.show">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script lang="ts" setup>
import type { Provider } from '~/node_modules/@supabase/auth-js/src/lib/types';
import type { Loaders } from '#imports';

const registrationAvailable = false;
const loginWithEmailAvailable = true;
const loginWithProviderAvailable = false;
const loginWithTelegramAvailable = false;
const loginWithKeycloakAvailable = false;
const guestAvailable = false;

const snackbar = ref({
  show: false,
  text: ''
});

const loaders: Ref<Loaders> = ref({
  loginEmail: false
});

const user = useSupabaseUser()
const { auth } = useSupabaseClient()

const redirectPath = useCookie('sb-redirect-path');
const defaultRedirectPath = useDefaultPage().path;
watchEffect(() => {
  if (user.value) {
    if (redirectPath.value) {
      navigateTo(redirectPath.value)
    } else {
      navigateTo(defaultRedirectPath)
    }
  }
})

async function authByTelegram(user: any) {
  console.log(user, 'hehe');
}

async function signInWithProvider(provider: string) {
  const { data, error } = await auth.signInWithOAuth({
    provider: provider as Provider,
  })
}

async function signInWithKeycloak() {
  console.log(1);
  const { data, error } = await auth.signInWithOAuth({
    provider: 'keycloak',
    options: {
      scopes: 'openid',
    },
  })
  console.log(data, error);
}

const loginEmail = ref('');
const loginPassword = ref('');
const show = ref({ passwordLogin: false });
const loginFormIsValid: Ref<null | boolean> = ref(null);

async function signInWithEmail() {
  if (!loginFormIsValid.value) {
    loginFormIsValid.value = false;
    return;
  }
  loaders.value.loginEmail = true;
  const { data, error } = await auth.signInWithPassword({
    email: loginEmail.value,
    password: loginPassword.value,
  })
  loaders.value.loginEmail = false;
  if (error) {
    snackbar.value.text = error.message;
    snackbar.value.show = true;
  }

}

async function singInAsGuest() {
  const { data, error } = await auth.signInAnonymously()
  console.log(data, error);

}

const signupEmail = ref('');
const signupPassword = ref('');
async function signUpNewUser() {
  const { data, error } = await auth.signUp({
    email: signupEmail.value,
    password: signupPassword.value,
    options: {
      emailRedirectTo: defaultRedirectPath,
    },
  })
}

function required(v: string) {
  return !!v || 'Field is required'
}

</script>


<style scoped>
.login-card {
  width: 400px;
}
</style>