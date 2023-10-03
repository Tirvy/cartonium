<script setup lang="ts">
definePageMeta({
  layout: "login",
})

const user = useSupabaseUser()
const { auth } = useSupabaseClient()

watchEffect(() => {
  if (user.value) {
    navigateTo('/clubs/emarena/add-games')
  }
})

async function signInWithGitHub() {
  const { data, error } = await auth.signInWithOAuth({
    provider: 'github',
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
          <v-card-actions>

            <v-btn @click="signInWithGitHub">connect with Github</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
