<template>
  <v-main><v-container fill-height fluid class="d-flex align-center">
      <v-row class="justify-center align-center">
        <v-col style="max-width: 600px;">
          <v-card>
            <v-card-title class="bg-surface">
              Ваша бронть принята!
            </v-card-title>
            <v-card-text>
              <v-list lines="three">
                <v-list-item>
                    <template v-slot:prepend>
                      <v-avatar color="grey-lighten-1">
                        <v-icon color="white">mdi-calendar</v-icon>
                      </v-avatar>
                    </template>
                  <v-list-item-title>
                    Дата и время
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    12:22, 25 июня 2023
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <template v-slot:prepend>
                      <v-avatar color="grey-lighten-1">
                        #
                      </v-avatar>
                    </template>
                  <v-list-item-title>
                    Сколько вас будет?
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ lastGathering.guestsMax }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                    <template v-slot:prepend>
                      <v-avatar color="grey-lighten-1">
                        <v-icon color="white">mdi-note</v-icon>
                      </v-avatar>
                    </template>
                  <v-list-item-title>
                    Комментарий
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Вы самые лучшие в лорем ипсуме данной планеты с играми каак серп, алимики и тому подобные твари
                    азаза азазат азазазазимовичовский 25 декабря 31 цикла моей любимой игры
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>

</template>

<script lang="ts" setup>

const lastGathering = useState('lastGathering') as Ref<Gathering>;

if (!lastGathering.value) {
  navigateTo('./item');
}

console.log(lastGathering.value);

</script>

<style scoped></style>