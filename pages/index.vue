<script setup lang="ts">
import type { Provider } from '~/node_modules/@supabase/auth-js/src/lib/types';
definePageMeta({
  layout: "login",
})

const user = useSupabaseUser()
const { auth } = useSupabaseClient()


watchEffect(() => {
  if (user.value) {
    navigateTo('/clubs/emarena/collection')
  }
})

async function signInWithProvider(provider: string) {
  const { data, error } = await auth.signInWithOAuth({
    provider: provider as Provider,
  })
}

const loginEmail = ref('');
const loginPassword = ref('');
async function signInWithEmail() {
  const { data, error } = await auth.signInWithPassword({
    email: loginEmail.value,
    password: loginPassword.value,
  })
}

const signupEmail = ref('');
const signupPassword = ref('');
async function signUpNewUser() {
  const { data, error } = await auth.signUp({
    email: signupEmail.value,
    password: signupPassword.value,
    options: {
      emailRedirectTo: 'http://192.168.100.5:3000/clubs/emarena/add-games',
    },
  })
}


</script>

<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col class="d-flex justify-center">
        <v-card>
          <v-card-title>
            login with email
          </v-card-title>
          <v-card-actions>
            <v-form class="w-100">
              <v-text-field v-model="loginEmail" label="email"></v-text-field>
              <v-text-field v-model="loginPassword" label="email"></v-text-field>
              <v-btn @click="signInWithEmail">login</v-btn>
            </v-form>
          </v-card-actions>
          <v-card-title>
            login with providers
          </v-card-title>
          <v-card-actions>
            <v-btn icon="mdi-github" @click="signInWithProvider('github')"></v-btn>
            <v-btn icon="mdi-google" @click="signInWithProvider('google')"></v-btn>
            <v-btn icon="mdi-facebook" @click="signInWithProvider('facebook')"></v-btn>
            <v-btn icon="mdi-discord" @click="signInWithProvider('discord')">d</v-btn>
          </v-card-actions>
          <v-divider />
          <v-card-title>
            signup with email
          </v-card-title>
          <v-card-actions>
            <v-form class="w-100">
              <v-text-field v-model="signupEmail" label="email"></v-text-field>
              <v-text-field v-model="signupPassword" label="email"></v-text-field>
              <v-btn @click="signUpNewUser">sign up</v-btn>
            </v-form>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
