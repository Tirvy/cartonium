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
  console.log(query)

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
    if (signInRes.error) {
      const signUpRes = await supabase.auth.signUp({
        email,
        password,
      })
    }
    navigateTo(query.next as string || '/', {
      replace: true,
    })
  }
});

</script>

<style scoped></style>