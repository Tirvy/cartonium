<template>
  <v-app id="inspire">
    <v-app-bar class="px-3" flat density="compact">
      <v-tabs centered color="grey-darken-2">
        <v-tab to="/visits-offload">visits</v-tab>
        <v-tab to="/visiters-offload">visiters</v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>

          <v-col cols="12" md="12">
            <v-sheet min-height="70vh" rounded="lg">
              <slot />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const links = [
  'Dashboard',
  'Messages',
  'Profile',
  'Updates',
]
</script>

<script>
export default {
  data: () => ({
    links: [
      'Dashboard',
      'Messages',
      'Profile',
      'Updates',
    ],
  }),
}
</script>