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
import type { Loaders } from '#imports'
import { authClient } from '~/utils/auth-client'

const registrationAvailable = false
const loginWithEmailAvailable = true
const loginWithTelegramAvailable = true

const snackbar = ref({
  show: false,
  text: '',
})

const loaders: Ref<Loaders> = ref({
  loginEmail: false,
})

const user = useAuthUser()
const { update: updateUserPermissions } = useClubPermissions()

const redirectPath = useCookie('auth-redirect-path')
const defaultRedirectPath = useDefaultPage().path
watchEffect(() => {
  if (user.value) {
    if (redirectPath.value) {
      navigateTo(redirectPath.value)
    } else {
      navigateTo(defaultRedirectPath)
    }
  }
})

async function authByTelegram(_data: unknown) {
  await updateUserPermissions()
}

const loginEmail = ref('')
const loginPassword = ref('')
const show = ref({ passwordLogin: false })
const loginFormIsValid: Ref<null | boolean> = ref(null)

async function signInWithEmail() {
  if (!loginFormIsValid.value) {
    loginFormIsValid.value = false
    return
  }
  loaders.value.loginEmail = true
  const { error } = await authClient.signIn.email({
    email: loginEmail.value,
    password: loginPassword.value,
  })
  loaders.value.loginEmail = false
  if (error) {
    snackbar.value.text = error.message || 'Login failed'
    snackbar.value.show = true
    return
  }
  await updateUserPermissions()
}

const signupEmail = ref('')
const signupPassword = ref('')
async function signUpNewUser() {
  const { error } = await authClient.signUp.email({
    email: signupEmail.value,
    password: signupPassword.value,
    name: signupEmail.value.split('@')[0] || 'User',
  })
  if (error) {
    snackbar.value.text = error.message || 'Sign up failed'
    snackbar.value.show = true
  }
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
