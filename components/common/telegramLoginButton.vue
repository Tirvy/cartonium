<template>
  <div ref="telegramLoginButton"></div>
</template>

<script lang="ts" setup>

const telegramLoginButton = ref<null | HTMLElement>(null);
const props = defineProps<{
  next?: string
}>();
const emit = defineEmits(['auth']);

onMounted(() => {
  const defaultPage = useDefaultPage();
  if (telegramLoginButton.value) {
    const useCallback = false;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'emarena_bot');
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-userpic', 'false');
    if (useCallback) {
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    }
    else {
      const nextRoute = props.next || '/';
      script.setAttribute('data-auth-url', '/auth/telegram-callback?next=' + nextRoute);
    }
    script.setAttribute('data-request-access', 'write');
    telegramLoginButton.value.appendChild(script);
  }
})

</script>

<style scoped></style>