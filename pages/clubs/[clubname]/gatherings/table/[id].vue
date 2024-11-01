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
    loadingList: boolean,
    gatheringsWithDates: GatheringsWithDates[],
    gatheringsComputedValues: { [id: string]: GatheringComputedValue }
}>();

const emits = defineEmits(['gatheringEdit', 'gatheringRemove', 'showDialogGuests', 'guestSet']);
const currentClub: Ref<Club> = useState('club');

const route = useRoute();
const gatheringId = +route.params.id;

const gathwd = computed<GatheringWithGuests | undefined>(() => {
    const found = props.gatheringsWithDates.find((gathwd: any) => gathwd.gathering?.id === gatheringId);
    if (found && found.type === 'gathering') {
        return found.gathering;
    }
    return undefined;
})

watch(() => props.loadingList, () => {
    if (!props.loadingList) {
        if (!gathwd.value) {
            navigateTo('../table/list', { replace: true });
        }
        if (gathwd) {
            setHead();
        }
    }
}, { immediate: true });

function gatheringEdit(gathering: Gathering) {
    emits('gatheringEdit', gathering);
}
function gatheringRemove(gathering: Gathering) {
    emits('gatheringRemove', gathering);
}
function showDialogGuests(gathering: Gathering) {
    emits('showDialogGuests', gathering);
}
function guestSet(gatheringId: number, number: number) {
    emits('guestSet', gatheringId, number);
}


function setHead() {
    if (!gathwd.value) {
        return;
    }
    const gathering = gathwd.value;
    const ogTitle = `Собираю "${gathering.gamebox?.title || gathering.ownTitle}"`;
    const date = new Date(gathering.startDate).toLocaleString('ru');
    const ogDescription = `Присоединяйтесь ${date} в клубе ${currentClub.value.title}`;
    const ogImage = gathering.gamebox?.photoUrl;
    const ogUrl = `${route.fullPath}`;
    // const ogUrl = new URL(route.fullPath, window?.location.origin).href;

    useSeoMeta({
        ogType: 'website',
        ogSiteName: 'Cartonis',
        ogLocale: 'ru',
        description: ogDescription,
        ogTitle: ogTitle,
        ogUrl: ogUrl,
        ogDescription: ogDescription,
        ogImage: ogImage,
    })
}
setHead();


definePageMeta({
    name: 'gatherings-linked-item',
});
</script>