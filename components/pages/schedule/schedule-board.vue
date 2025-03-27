<template>
  <v-card>
    <v-row v-if="mobile">
      <v-col>
        <v-window v-model="daySlideNumber" show-arrows>
          <v-window-item v-for="(day, dayIndex) in days" :key="dayIndex">
            <v-card class="align-center">

              <v-card-title class="text-center">
                {{ dayNames[dayIndex] }}
              </v-card-title>
              <v-card-actions class="d-flex flex-column">
                <v-btn-toggle :model-value="day" hide-details multiple class="flex-column" style="height: auto;"
                  @touchmove.prevent @mousedown="checkMousedown" @touchstart="checkMousedown" @mouseup="checkMouseup"
                  @mouseexit="checkMouseup" @touchend="checkMouseup">
                  <v-btn v-for="(timeName, timeIndex) in timeNames" :key="timeIndex" :value="timeIndex"
                    :day-index="dayIndex" :time-index="timeIndex" @mousemove="checkMouseenter"
                    @touchmove="checkMouseenter">
                    {{ timeName }}
                  </v-btn>
                </v-btn-toggle>
              </v-card-actions>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
    <v-row v-else @mousedown="checkMousedown" @touchstart="checkMousedown" @mouseup="checkMouseup"
      @mouseexit="checkMouseup" @touchend="checkMouseup">
      <v-col v-for="(day, dayIndex) in days" :key="dayIndex" class="d-flex flex-column">
        <div class="text-center">
          {{ dayNames[dayIndex] }}
        </div>
        <v-btn-toggle :model-value="day" hide-details multiple class="flex-column" style="height: auto;"
          @touchmove.prevent>
          <v-btn v-for="(timeName, timeIndex) in timeNames" :key="timeIndex" :value="timeIndex" :day-index="dayIndex"
            :time-index="timeIndex" @mousemove="checkMouseenter" @touchmove="checkMouseenter">
            {{ timeName }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  loading?: boolean,
  startDate?: Date,
  // segmentSize: number,
  segments?: boolean[]
}>();
import { useDisplay } from 'vuetify';
const { mobile } = useDisplay();
const daySlideNumber = ref(0);
const dayjs = useDayjs();
const defaultSegmentSize = 60; //minutes
const segmentsInDay = 24 * 60 / defaultSegmentSize;
const defaultWeekLength = 7;
const defaultSegmentsLength = defaultWeekLength * segmentsInDay; // days, hours, minutes / size
const timeNames = computed(() => {
  let iteratingDatetime = dayjs(props.startDate).startOf('day');
  let ret = [];
  for (let i = 0; i < segmentsInDay; ++i) {
    ret.push(iteratingDatetime.format('hh:mm'));
    iteratingDatetime = iteratingDatetime.add(defaultSegmentSize, 'minutes');
  }
  return ret;
});
const dayNames = computed(() => {
  let iteratingDatetime = dayjs(props.startDate).startOf('day');
  let ret = [];
  for (let i = 0; i < defaultWeekLength; ++i) {
    ret.push(iteratingDatetime.format('dd'));
    iteratingDatetime = iteratingDatetime.add(1, 'day');
  }
  return ret;
});

const mouseDownBorders = ref<{ start: number | null, end: number | null }[] | null>(null)
function checkMousedown(event: MouseEvent) {
  if (!mouseDownBorders.value) {
    mouseDownBorders.value = new Array(defaultWeekLength).fill({});
    mouseDownBorders.value = mouseDownBorders.value.map(item => {
      return { start: null, end: null }
    });
  }
  checkMouseenter(event);
}
function checkMouseup() {
  if (mouseDownBorders.value) {
    updateSegments();
    mouseDownBorders.value = null;
  }
}
function checkMouseenter(event: MouseEvent | TouchEvent) {
  if (mouseDownBorders.value) {
    const targetElement = (() => {
      if (event.type.includes('touch')) {
        const touchEvent = event as TouchEvent;
        const xcoord = touchEvent.touches ? touchEvent.touches[0].clientX : touchEvent.targetTouches[0].clientX;
        const ycoord = touchEvent.touches ? touchEvent.touches[0].clientY : touchEvent.targetTouches[0].clientY;
        // get element in coordinates:
        const targetElement = document.elementFromPoint(xcoord, ycoord);
        return targetElement as HTMLElement;
      }
      return event.target as HTMLElement;
    })();


    const buttonElement = targetElement.closest('[day-index]');
    if (!buttonElement) {
      // its a touch action out of bounds, so no action required
      return;
    }
    const dayIndex = +(buttonElement.getAttribute('day-index') as string);
    const timeIndex = +(buttonElement.getAttribute('time-index') as string);

    const start = mouseDownBorders.value[dayIndex].start;
    if (!start) {
      mouseDownBorders.value[dayIndex].start = timeIndex;
    } else if (start === timeIndex) {
      mouseDownBorders.value[dayIndex].start = null;
    } else {
      mouseDownBorders.value[dayIndex].end = timeIndex;
    }
    // invertSegment(dayIndex, timeIndex);
  }
}

function calcSourceSegments() {
  const initSegments = [...segmentsSource.value];
  if (mouseDownBorders.value !== null) {
    mouseDownBorders.value.forEach((dayChanges, dayIndex) => {
      const s = dayChanges.start;
      const e = dayChanges.end;
      if (s !== null && e !== null) {
        for (let i = Math.min(s, e); i <= Math.max(s, e); ++i) {
          initSegments[dayIndex * segmentsInDay + i] = !initSegments[dayIndex * segmentsInDay + i];
        }
      } else if (s !== null) {
        initSegments[dayIndex * segmentsInDay + s] = !initSegments[dayIndex * segmentsInDay + s];
      }
    });
  }
  return initSegments;
}
function updateSegments() {
  const newSegments = calcSourceSegments();
  emit('change', newSegments);
}


const startDate = computed(() => {
  const startDate = dayjs(props.startDate || new Date()).weekday(0);
  return startDate;
})

const segmentsSource = computed(() => {
  if (props.segments && props.segments.length === defaultSegmentsLength) {
    return props.segments;
  }
  return new Array(defaultSegmentsLength).fill(false)
});

const days = computed<boolean[][]>(() => {
  let ret = [];
  const segments = calcSourceSegments();
  for (let i = 0; i < segments.length; i += segmentsInDay) {
    const chunk = segments.slice(i, i + segmentsInDay);
    ret.push(chunk.map((value, index) => value && index).filter(e => e !== false));
  }
  return ret;
});

function invertSegment(dayIndex: number, timeIndex: number) {
  const segmentIndex = dayIndex * segmentsInDay + timeIndex;
  const ret = [...segmentsSource.value];
  ret[segmentIndex] = !ret[segmentIndex];
  emit('change', ret);
}


const emit = defineEmits<{
  (e: 'change', value: boolean[]): void
}>()

</script>

<style scoped lang="scss">
.time-segment {
  background-color: grey;
  margin: 4px;
  padding: 4px;
  border-radius: 2px;

  &.active {
    background-color: yellow;
    color: #fff;
  }
}
</style>