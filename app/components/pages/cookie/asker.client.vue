<template>
  <v-banner :avatar="shownAvatar" stacked v-if="cookieBasic !== '1'" class="pb-20 flex-0-0 banner-head" :sticky="true">
    <template v-slot:text>
      Этот сайт использует cookies для обеспечения работы сайта. Пожалуйста, прочитайте нашу
      <nuxt-link :to="policyLink" target="_blank">Политику
        конфиденциальности</nuxt-link>
      для получения более подробной информации. Подтвердив использование cookies, вы соглашаетесь с использованием
      cookies.
    </template>

    <template v-slot:actions>
      <v-dialog v-model="dialog" max-width="500">
        <template v-slot:activator="{ props }">
          <v-btn class="text-none" color="blue-darken-4" rounded="0" variant="outlined" v-bind="props">
            Настроить
          </v-btn>
        </template>

        <v-card title="Cookie Settings">
          <v-card-text>
            <p class="pb-4">
              Этот сайт использует cookies для обеспечения работы сайта. Пожалуйста, прочитайте нашу
              <nuxt-link :to="policyLink" target="_blank">Политику
                конфиденциальности</nuxt-link>
              для получения более подробной информации.
            </p>

            <v-list-subheader class="font-weight-black text-high-emphasis">Обязательные Cookies</v-list-subheader>

            <p class="mb-4">Эти cookies необходимы для работы сайта и не могут быть выключены.</p>

            <v-list-subheader class="font-weight-black text-high-emphasis">Дополнительные Cookies</v-list-subheader>

            <v-switch v-model="cookiePerformaceEditing" :label="cookiePerformaceEditing ? 'On' : 'Off'"
              color="blue-darken-4" density="compact" hide-details inline inset></v-switch>

            <p class="mb-4">Позволят нам учитывать ваши действия на сайте чтобы следать всё лучше.</p>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="justify-center px-6 py-3">
            <v-btn class="flex-grow-1 text-none" color="blue-darken-4" rounded="0" variant="plain" @click="declineAll">
              Отказаться от необязательных
            </v-btn>

            <v-btn class="text-white flex-grow-1 text-none" color="blue-darken-4" rounded="0" variant="flat"
              @click="save">
              Сохранить и принять
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn class="text-none ms-4 text-white" color="blue-darken-4" rounded="0" variant="flat" @click="acceptAll">
        Принять все Cookies
      </v-btn>
    </template>
  </v-banner>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify';
const dialog = ref(false);
const cookieBasic = ref("");
const cookiePerformance = ref("");
const cookiePerformaceEditing = ref(true);
const policyLink = '/privacy-policy.html';

const { mobile } = useDisplay();

const props = defineProps<{
  avatar: string,
}>();

const shownAvatar = computed(() => {
  if (props.avatar && !mobile.value) {
    return props.avatar;
  }
  return undefined;
});


onBeforeMount(() => {
  cookieBasic.value = localStorage.getItem("agreed-to-cookie") + '';
  cookiePerformance.value = localStorage.getItem("agreed-to-cookie-performance") + '';
  cookiePerformaceEditing.value = cookiePerformance.value === '1';
});

function declineAll() {
  cookieBasic.value = '1';
  cookiePerformance.value = '0';
  updateLocalStorage();
  dialog.value = false;
}

function save() {
  cookieBasic.value = '1';
  cookiePerformance.value = cookiePerformaceEditing.value ? '1' : '0';
  updateLocalStorage();
  dialog.value = false;
}

function acceptAll() {
  cookieBasic.value = '1';
  cookiePerformance.value = '1';
  updateLocalStorage();
  dialog.value = false;
}

function updateLocalStorage() {
  localStorage.setItem("agreed-to-cookie", cookieBasic.value);
  localStorage.setItem("agreed-to-cookie-performance", cookiePerformance.value);
}

</script>

<style scoped>
.pb-20 {
  padding-bottom: 80px;
}

.banner-head {
  bottom: 0;
}
</style>