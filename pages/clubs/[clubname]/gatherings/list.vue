<template></template>

<script setup lang="ts">
const gatherings = ref([]);

async function getGatherings() {
    const { data } = $fetch('/api/supabase/gatherings');
    gatherings.value = data;
}

</script>