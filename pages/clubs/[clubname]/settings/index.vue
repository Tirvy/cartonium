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
        <v-card>
          <v-card-title>
            Общие настройки
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-switch label="Разрешить бронировать"></v-switch>
              </v-list-item>
              <v-list-item>
                <v-switch label="Разрешить создавать свои игры"></v-switch>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn>Сохранить изменения</v-btn>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
</script>

<style scoped></style>