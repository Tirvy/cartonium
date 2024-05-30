<template>
  <div ref="telegramLoginButton"></div>
</template>

<script lang="ts" setup>

const telegramLoginButton = ref<null | HTMLElement>(null);
const emit = defineEmits(['auth']);

(window as any).onTelegramAuth = (user: any) => {
  alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' +
    user.username : '') + ')');
  emit('auth', user);
}

onMounted(() => {
  if (telegramLoginButton.value) {
    const useCallback = false;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'emarena_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'true');
    if (useCallback) {
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    }
    else {
      script.setAttribute('data-auth-url', '/auth/callback');
    }
    script.setAttribute('data-request-access', 'write');
    telegramLoginButton.value.appendChild(script);
  }
})

</script>

<style scoped></style>