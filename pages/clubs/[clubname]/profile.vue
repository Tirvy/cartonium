<template>
  <v-main>
    <v-container class="h-100">
      <v-row class="h-100 align-center justify-center">
        <v-col v-if="!user" class="d-flex justify-center">
          <common-login></common-login>
        </v-col>
        <v-col v-else class="text-center">
          <v-btn @click="logout">
            Logout
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/')
}

</script>