<template>
  <div>

  </div>
</template>

<script lang="ts" setup>

onMounted(async () => {


  // const result = await $fetch<{ url: string }>('/api/common/try-register', {
  //   query
  // });
  // const url = result?.url;
  // if (url) {
  //   navigateTo(url, {
  //     replace: true,
  //   })
  // }

  const route = useRoute();
  const query = route.query;
  const tgData = query as unknown as TelegramLoginPayload;

  const credsRes = await $fetch<{ login: string, password: string }>('/api/common/get-creds', { query });
  if (!credsRes) {
    return;
  }

  const supabase = useSupabaseClient()
  const email = credsRes.login;
  const password = credsRes.password;
  if (email && password) {
    const signInRes = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!signInRes.error && signInRes.data) {
      await supabase.auth.updateUser({
        data: getMetadataObject(tgData),
      })
    }
    if (signInRes.error && !signInRes.data) {
      const signUpRes = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: getMetadataObject(tgData),
        }
      })
    }
    navigateTo(query.next as string || '/', {
      replace: true,
    })
  }
});


function getMetadataObject(tgData: TelegramLoginPayload) {
  return {
    telegram_id: tgData.id,
    full_name: [tgData.first_name, tgData.last_name].filter(Boolean).join(' '),
    first_name: tgData.first_name,
    avatar_url: tgData.photo_url,
    picture: tgData.photo_url,
    telegram_username: tgData.username,
    is_imaginery: true,
  }
}

</script>

<style scoped></style>