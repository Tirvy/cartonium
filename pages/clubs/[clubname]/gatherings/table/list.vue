<template>
  <v-container>
    <v-row class="justify-space-between" v-if="clubPermissions">
      <v-col>
      </v-col>
      <v-spacer />
      <v-col>
        <NuxtLink to="./table-admin">
          <v-list-item :link="true">
            {{ $t('to_admin_view') }}

          </v-list-item>
        </NuxtLink>
      </v-col>
    </v-row>

    <v-empty-state v-if="!user && gatheringsWithDates.length > 0"
      :text="$t('gatherings.login_to_join')" :title="$t('gatherings.registration_is_free')" />

    <v-row v-if="user && gatheringsWithDates.length > 0" dense>
      <v-col cols="12">
        <v-btn-toggle v-model="tableView" @update:model-value="saveViewPreferance" variant="outlined" mandatory divided
          rounded density="compact" class="w-100">
          <v-btn value="minimal" icon="mdi-view-sequential-outline" class="flex-grow-1">
          </v-btn>

          <!-- <v-btn value="compact" icon="mdi-view-compact-outline" class="flex-grow-1"> -->
          <!-- </v-btn> -->
          <v-btn value="compact" icon="mdi-view-day-outline" class="flex-grow-1">
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>


    <template v-if="loadingList">
      <v-row>
        <v-col>
          <v-skeleton-loader type="heading" width="300px" />
        </v-col>
      </v-row>
      <v-row v-for="n in 4">
        <v-col>
          <pages-gatherings-table-item-skeleton :view="tableView"></pages-gatherings-table-item-skeleton>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row v-for="gathwd in gatheringsWithDates" :key="gathwd.date">
        <v-col v-if="gathwd.type === 'date'" class="mt-4">
          <common-week-indicator :date="gathwd.dateObj"></common-week-indicator>
        </v-col>

        <v-col v-else-if="gathwd.gathering">
          <pages-gatherings-table-item :view="tableView" :gathering="gathwd.gathering"
            :loading="loadingId === gathwd.gathering.id"
            :gatheringComputedValue="gatheringsComputedValues[gathwd.gathering.id]" @showDialogGuests="showDialogGuests"
            @guestSet="guestSet" @edit="gatheringEdit(gathwd.gathering)"
            @remove="gatheringRemove(gathwd.gathering)"></pages-gatherings-table-item>
        </v-col>
      </v-row>
    </template>

    <v-empty-state v-if="gatheringsWithDates.length === 0 && user && !loadingList"
      :text="$t('gatherings.use_button_to_create_gathering')" :title="$t('gatherings.gatherings_not_found')" />
    <v-empty-state v-else-if="gatheringsWithDates.length === 0 && !loadingList"
      :text="$t('gatherings.login_to_join')"
      :title="$t('gatherings.gatherings_not_found')" />
  </v-container>
  <v-fab v-if="user" location="bottom end" icon="mdi-plus" :to="{ name: 'gathering-edit' }" app size="large"
    variant="outlined" order="1">
    <v-icon icon="mdi-plus"></v-icon>
    <v-tooltip activator="parent" location="start">{{$t('gathering.create_gathering')}}</v-tooltip>
  </v-fab>
</template>

<script lang="ts" setup>
const user = useSupabaseUser();
const { clubPermissions } = useClubPermissions();

const props = defineProps<{
  loadingId: number,
  gatheringsWithDates: GatheringsWithDates[],
  gatheringsComputedValues: { [id: string]: GatheringComputedValue },
  loadingList: boolean,
}>();
const emits = defineEmits(['gatheringEdit', 'gatheringRemove', 'showDialogGuests', 'guestSet']);


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


// ---- view -----
onBeforeMount(() => {
  let stored = localStorage.getItem('gatherings-view');
  if (stored && (stored === 'minimal' || stored === 'compact' || stored === 'full')) {
    tableView.value = stored;
  }
})
const tableView = ref<'minimal' | 'compact' | 'full'>('minimal');

function saveViewPreferance(value: string) {
  localStorage.setItem('gatherings-view', value);
}
// end ---- view -----


definePageMeta({
  name: 'gatherings-table-list',
});
</script>

<style scoped></style>