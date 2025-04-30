<template>
  <v-main>
    <v-container>
      <v-card>
        <v-card-title>
          <v-text-field v-model="schedule.title"></v-text-field>
          <v-btn @click="saveSchedule" :loading="loaders.save">Сохранить</v-btn>
        </v-card-title>
        <v-card-actions>
        </v-card-actions>
        <v-card-actions v-if="currentSegmentsSource">
          <PagesScheduleBoard :segments="currentSegmentsSource.segments" :startDate="startDate"
            @change="changeSchedule">
          </PagesScheduleBoard>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>

  <v-snackbar v-model="snackbar.show">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script setup lang="ts">
const route = useRoute();
const dayjs = useDayjs();
const initialScheduleName = 'Расписание от ' + dayjs(new Date()).format('DD.MM');
const startDate = dayjs(new Date()).weekday(0);
const loaders = ref({
  save: false,
  fetching: false,
});

const snackbar = ref({
  show: false,
  text: 'Сохранение успешно'
})

const schedule = ref<Schedule>({
  title: initialScheduleName,
  id: 0,
  visibility: 'hidden',
  history: [],
});

const currentSegmentsSource = computed<ScheduleHistoryItem>(() => {
  if (schedule.value.history.length) {
    return schedule.value.history[0];
  }
  return {
    created: new Date(),
    segmentSize: 30,
    segments: [],
    id: 0,
  };
})

async function saveSchedule() {
  const savedObject = {
    title: schedule.value.title,
    id: schedule.value.id,
    segments: currentSegmentsSource.value?.segments,
    startDate: startDate,
  }
  if (!savedObject.id) {

    loaders.value.save = true;
    const data: any = await $fetch('/api/supabase/schedule', {
      method: 'post',
      body: {
        ...savedObject,
      }
    })
    loaders.value.save = false;
    snackbar.value.show = true;
  } else {

    loaders.value.save = true;
    const data: any = await $fetch('/api/supabase/schedule', {
      method: 'post',
      body: {
        ...savedObject,
      }
    })
    loaders.value.save = false;
    snackbar.value.show = true;
  }
  console.log(savedObject)
}

const scheduleSegmentsEditing = ref<boolean[]>([]);
const changeSchedule = (value: boolean[]) => {
  scheduleSegmentsEditing.value = value;
}

const queryScheduleId = +route.params.id;
if (queryScheduleId) {
  const { data: foundSchedule, execute: getSchedule, status: getScheduleStatus } = await useLazyFetch<Schedule>(
    '/api/supabase/schedule-find',
    {
      query: {
        scheduleId: +route.params.id,
      },
      deep: false,
      immediate: false,
    }
  );
  await getSchedule();

  if (!foundSchedule.value) {
    // todo: нормальный всплывашек об ошибке
    navigateTo('./not-found');
  } else {
    schedule.value = foundSchedule.value;
  }
}

definePageMeta({
  name: 'schedules-item',
});
</script>
