<template>
  <v-main>
    <v-container>
      <template v-if="loadingList">
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>
                Здесь вы можете создавать расписание своего свободного времени и вместе в друзьями находить удобные даты
                для встреч
              </v-card-title>
              <v-card-actions>
                <v-btn prepend-icon="mdi-plus" to="./schedules/item">Создать расписание</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <template v-if="getSchedulesStatus === 'pending'">
          <v-row v-for="n in 4">
            <v-col>
              <v-skeleton-loader type="heading,sentences" />
            </v-col>
          </v-row>
        </template>

        <template v-else-if="getSchedulesStatus === 'error' || (schedules?.length || 0) < 1">
          Не найдено созданных вами расписаний
        </template>

        <template v-if="getSchedulesStatus === 'success' && (schedules?.length || 0) > 0">
          <v-row>
            <v-col>
              <v-card>
                <v-card-title>
                  {{ $t('schedules_list') }}
                </v-card-title>
                <v-card-text>
                  <nuxt-link v-for="schedule in schedules" :to="'./item/' + schedule.id">
                    <v-list-item link :title="schedule.title"></v-list-item>

                  </nuxt-link>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </template>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
const loadingList = true;
definePageMeta({
  name: 'schedules',
});


const { data: schedules, refresh: getSchedules, status: getSchedulesStatus } = await useFetch<Schedule[]>(
  '/api/supabase/schedule-list'
);
</script>