<template>
    hi
</template>

<script setup>
console.log('hi');

async function getBookings() {
    const data = await $fetch('/api/supabase/gatherings-get');
}
getBookings();
</script>