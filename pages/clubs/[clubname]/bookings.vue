<template>
    hi
</template>

<script setup>
console.log('hi');

const currentClub = useState('club');
async function getBookings() {
    const data = await $fetch('/api/supabase/gatherings-get', {
        query: {
            clubid: currentClub.value.id,
        }
    });
}
getBookings();
</script>