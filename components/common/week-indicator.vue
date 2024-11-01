<template>
  <v-container class="week-indicator-root" dense>
    <div dense>
      <div class="monthnames">
        <div>
          <v-icon icon="mdi-calendar-range" class="mr-1"></v-icon>
          {{ startMonthName }}
        </div>
        <div v-if="showEndMonthName">
          {{ endMonthName }}
        </div>
      </div>
    </div>
    <div class="week-indicator-row" dense>
      <v-col v-for="day in days" :key="day.i" class="day" :class="{ 'target': day.isTarget, 'text-amber-darken-4': day.isWeekend }">
        {{ day.number }}
      </v-col>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
const props = defineProps<{
  date: Date
}>();
const dayjs = useDayjs()

const startDate = computed(() => {
  const startDate = dayjs(props.date).weekday(0);
  return startDate;
})

const startMonthName = computed(() => {
  return startDate.value.format('MMMM');
})

const endMonthName = computed(() => {
  const endDate = dayjs(props.date).weekday(6);
  return endDate.format('MMMM');
})
const showEndMonthName = computed(() => {
  return startMonthName.value !== endMonthName.value;
})

const days = computed(() => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = dayjs(startDate.value).add(i, 'day');
    days.push({
      date: day,
      number: day.format('D'),
      isWeekend: day.day() === 6 || day.day() === 0,
      i: i,
      // isCurrentMonth: day.getMonth() === startDate.value.getMonth(),
      isToday: day.isSame(dayjs(), 'day'),
      isTarget: day.isSame(props.date, 'day'),
    });
  }
  return days;
});
</script>

<style scoped>
.week-indicator-root {
  display: inline-block;
  width: auto;
  line-height: 0.6;
  font-size: 0.8rem;
}

.monthnames {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0 8px;
  opacity: 0.8;
}

.week-indicator-row {
  display: flex;
}

.day {
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
  height: 20px;
  width: 20px;
  margin: 0 5px;
  border-bottom: 1px solid #ccc;
  opacity: 0.5;
}

.day.target {
  border: 1px solid #ccc;
  border-radius: 50%;
  opacity: 1;
}
</style>