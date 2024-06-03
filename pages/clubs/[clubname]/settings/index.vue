<template>
  <v-main>
    <v-container>
      <v-sheet>
        <v-list>
          <v-list-item>
            <NuxtLink to="./settings/themes">
              Настройка цветовой темы
            </NuxtLink>
          </v-list-item>
          <v-list-item>
            <NuxtLink to="./settings/tables">
              Настройка столов в клубе
            </NuxtLink>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
</script>

<style scoped></style>