<template>
    <v-container>
        <template v-if="gathwd">
            <pages-gatherings-table-item view="full" :gathering="gathwd" :loading="loadingId === gathwd.id"
                :gatheringComputedValue="gatheringsComputedValues[gathwd.id]" @showDialogGuests="showDialogGuests"
                @guestSet="guestSet" @edit="gatheringEdit(gathwd)"
                @remove="gatheringRemove(gathwd)"></pages-gatherings-table-item>
        </template>

        <template v-else>
            <pages-gatherings-table-item-skeleton view="full"></pages-gatherings-table-item-skeleton>
        </template>


        <v-fab location="bottom start" :to="{ name: 'gatherings-table-list' }" app size="large" variant="outlined"
            order="1">
            <v-icon icon="mdi-format-list-checkbox"></v-icon>
            <v-tooltip activator="parent" location="end">К списку сборов</v-tooltip>
        </v-fab>
    </v-container>
</template>

<script setup lang="ts">
const props = defineProps<{
    loadingId: number,
    gatheringsWithDates: GatheringsWithDates[],
    gatheringsComputedValues: { [id: string]: GatheringComputedValue }
}>();

const emits = defineEmits(['gatheringEdit', 'gatheringRemove', 'showDialogGuests', 'guestSet']);
const currentClub: Ref<Club> = useState('club');

const route = useRoute();
const gatheringId = +route.params.id;
const gathwd: Ref<GatheringWithGuests | undefined> = ref(undefined);

watch(() => props.gatheringsWithDates, () => {
    const found = props.gatheringsWithDates.find((gathwd: any) => gathwd.gathering?.id === gatheringId);
    if (found && found.type === 'gathering') {
        gathwd.value = found.gathering;
    }
    if (props.gatheringsWithDates.length && !gathwd) {
        throw new Error('gathering not found');
    }
    if (gathwd) {
        setHead();
    }
}, { immediate: true })

function gatheringEdit(gathering: Gathering) {
    emits('gatheringEdit', gathering);
}
function gatheringRemove(gathering: Gathering) {
    emits('gatheringRemove', gathering);
}
function showDialogGuests(gathering: Gathering) {
    emits('showDialogGuests', gathering);
}
function guestSet() {
    emits('guestSet');
}


function setHead() {
    if (!gathwd.value) {
        return;
    }
    const gathering = gathwd.value;
    const ogTitle = `Собираю "${gathering.gamebox?.title || gathering.ownTitle}"`;
    const ogDescription = `Присоединяйтесь ${gathering.startDate} в клубе ${currentClub.value.title}`;
    const ogImage = gathering.gamebox?.photoUrl;
    const ogUrl = `${route.fullPath}`;

    useHead({
        meta: [
            { hid: 'og:type', name: 'og:type', content: 'website' },
            { hid: 'og:site_name', property: 'og:site_name', content: 'Cartonis' },
            { hid: 'og:locale', property: 'og:locale', content: 'ru_RU' },
            { hid: 'description', name: 'description', content: ogDescription },
            { hid: 'og:title', property: 'og:title', content: ogTitle },
            { hid: 'og:url', property: 'og:url', content: ogUrl },
            { hid: 'og:description', property: 'og:description', content: ogDescription },
            { hid: 'og:image', property: 'og:image', content: ogImage },
        ]
    })
}



definePageMeta({
  name: 'gatherings-linked-item',
});
</script>