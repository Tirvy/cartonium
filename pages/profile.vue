<template>
  <v-main>
    <v-container class="h-100">
      <v-row class="h-100 align-center justify-center">
        <v-col class="text-center">
          <v-btn v-if="user" @click="logout">
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