<template>
  <v-banner :avatar="avatar" stacked v-if="cookieBasic !== '1'" class="pb-20 flex-0-0">
    <template v-slot:text>
      Этот сайт использует cookies для обеспечения работы сайта. Пожалуйста, прочитайте нашу
      <nuxt-link :to="policyLink" blank>Политику
        конфиденциальности</nuxt-link>
      для получения более подробной информации. Подтвердив использование cookies, вы соглашаетесь с использованием
      cookies.
    </template>

    <template v-slot:actions>
      <v-dialog v-model="dialog" max-width="500">
        <template v-slot:activator="{ props }">
          <v-btn class="text-none" color="blue-darken-4" rounded="0" variant="outlined" v-bind="props">
            Настроить Cookies
          </v-btn>
        </template>

        <v-card title="Cookie Settings">
          <v-card-text>
            <p class="pb-4">
              Этот сайт использует cookies для обеспечения работы сайта. Пожалуйста, прочитайте нашу
              <nuxt-link :to="policyLink" blank>Политику
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
const dialog = ref(false);
const cookieBasic = useCookie('agreed-to-cookie');
const cookiePerformance = useCookie('agreed-to-cookie-performance');
const policyLink = '/privacy-policy.html';

const props = defineProps<{
  avatar: string,
}>();

const cookiePerformaceEditing = ref(cookiePerformance.value === '1');
console.log(cookieBasic.value, cookiePerformance.value, cookiePerformaceEditing.value)

function declineAll() {
  cookieBasic.value = '1';
  cookiePerformance.value = '0';
  dialog.value = false;
}

function save() {
  cookieBasic.value = '1';
  cookiePerformance.value = cookiePerformaceEditing.value ? '1' : '0';
  dialog.value = false;
}

function acceptAll() {
  cookieBasic.value = '1';
  cookiePerformance.value = '1';
  dialog.value = false;
}

</script>

<style scoped>
.pb-20 {
  padding-bottom: 80px;
}
</style>