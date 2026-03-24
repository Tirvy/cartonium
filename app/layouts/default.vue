<template>
  <v-app id="inspire">

    <v-app-bar dense>

      <template v-slot:prepend>
        <v-avatar color="yellow">
          C
        </v-avatar>
      </template>


      <template v-slot:default>

        <v-app-bar-title>Cartonis</v-app-bar-title>

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn variant="tonal" v-bind="props" prepend-icon="mdi-web" class="mr-2">

              {{ locale }}
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(item, index) in locales" :key="index" :value="index" @click="setLocale(item.code)">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:append>
        <commonTelegramLoginButton />
      </template>
    </v-app-bar>

    <slot />

  </v-app>
</template>

<script setup lang="ts">

// locales
const { locales, locale, setLocale, t } = useI18n();

</script>