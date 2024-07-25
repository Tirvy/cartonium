<template>
  <v-app id="inspire">

    <v-app-bar dense>

      <template v-slot:prepend>
          <v-avatar color="yellow">
            C
          </v-avatar>
      </template>

      <v-app-bar-title>Cartonis</v-app-bar-title>
    </v-app-bar>

    <slot />

  </v-app>
</template>

<script setup lang="ts">

</script>