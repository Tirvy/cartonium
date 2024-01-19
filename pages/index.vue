<script setup lang="ts">
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
    provider,
  })
}
</script>

<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col class="d-flex justify-center">
        <v-card>
          <v-card-title>
            Sign in to your account
          </v-card-title>
          <div>
            <v-divider />

            <div class="text-center">
              connect with
            </div>

          </div>
          <v-card-actions>
            <v-btn icon="mdi-github" @click="signInWithProvider('github')"></v-btn>
            <v-btn icon="mdi-google" @click="signInWithProvider('google')"></v-btn>
            <v-btn icon="mdi-facebook" @click="signInWithProvider('facebook')"></v-btn>
            <v-btn icon="mdi-discord" @click="signInWithProvider('discord')">d</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
