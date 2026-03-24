<template>
  <v-main>
    <v-container>
      <v-card>
        <v-card-title>
          Настройка цветовых тем
        </v-card-title>
        <v-card-text>
          Вы можете настроить цвета интерфейса, чтобы они соответствовали вашему клубу.
          1. Выберете тему (светлая или темная), которую хотите настроить
          2. Выделяйте слева цвет, который хотите настроить.
          3. Настраивайте значение этого цвета.
          4. Проверяйте результат по кнопке "тест". Тема временно применится на всей странице для вас.
          5. Повторяйте 2-4, пока не будете удовлетворены. Кликните "Сохранить" внизу чтобы сохранить тему для всех
          пользователей вашего клуба.
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col>
              <v-btn-toggle v-model="chosenTheme" mandatory>
                <v-btn value="light">
                  light
                </v-btn>

                <v-btn value="dark">
                  dark
                </v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col>
              <v-btn @click="useThisTheme">Тестировать</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-list lines="one" :items="colorTypes" :selectable="true" v-model:selected="selectedColorTypeComputed"
                :mandatory="true" :return-object="true">

                <v-list-item v-for="colorType in colorTypes" :value="colorType.value" :key="colorType.value"
                  :title="colorType.title" :subtitle="colorType.subtitle">
                  <template v-slot:prepend>
                    <div class="color-example" :style="`background-color: ${colorValues[colorType.value]}`"></div>
                  </template>
                </v-list-item>

              </v-list>
            </v-col>
            <v-col>
              <v-color-picker v-model="currentColor" />
            </v-col>
            <v-col>
              <v-container>
                <v-row>
                  <v-col>
                    <v-card>
                      <v-card-title>
                        Заголовок
                      </v-card-title>
                      <v-card-text>
                        Какой-то контент
                        <v-list>
                          <v-list-subheader>
                            Список!
                          </v-list-subheader>
                          <v-list-item>
                            <v-list-item-title>
                              Пункт списка
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              описание пункта
                            </v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-title>
                              Пункт2списка
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              описание 2 пункта
                            </v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                      <v-card-text>
                        <v-combobox multiple chips closable-chips label="Combobox"
                          :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']" :error="true"
                          :error-messages="['error, ошибка!', 'another one']">
                        </v-combobox>
                      </v-card-text>
                      <v-card-text>
                        <v-switch label="Switch"></v-switch>
                      </v-card-text>
                      <v-divider />
                      <v-card-actions>
                        <v-btn>Да</v-btn>
                        <v-btn variant="tonal">Нет</v-btn>
                        <v-btn variant="outlined">Наверное</v-btn>
                        <v-btn variant="text" icon="mdi-folder"></v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn>
            Сохранить
          </v-btn>
          <v-btn>
            Сбрость по-умлочанию
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useTheme } from 'vuetify';

interface themeColor {
  value: string;
  title: string;
  subtitle: string;
}

const colorTypes: themeColor[] = [
  {
    value: 'primary',
    title: 'Основной цвет',
    subtitle: 'Основной цвет приложения'
  },
  {
    value: 'secondary',
    title: 'Вторичный цвет',
    subtitle: 'Вторичный цвет приложения'
  },
  {
    value: 'accent',
    title: 'Акцентный цвет',
    subtitle: 'Акцентный цвет приложения'
  },
  {
    value: 'error',
    title: 'Цвет ошибки',
    subtitle: 'Цвет для отображения ошибок'
  },
  {
    value: 'warning',
    title: 'Цвет предупреждения',
    subtitle: 'Цвет для отображения предупреждений'
  },
  {
    value: 'info',
    title: 'Информационный цвет',
    subtitle: 'Цвет для отображения информационных сообщений'
  },
  {
    value: 'success',
    title: 'Цвет успеха',
    subtitle: 'Цвет для отображения успешных операций'
  },
  {
    value: 'background',
    title: 'Цвет фона',
    subtitle: 'Цвет фона приложения'
  },
  {
    value: 'surface',
    title: 'Цвет поверхности',
    subtitle: 'Цвет поверхности приложения'
  },
  {
    value: 'outline',
    title: 'Цвет обводки',
    subtitle: 'Цвет обводки элементов'
  }
];
const theme = useTheme();
const themeList = theme.themes;

const chosenThemeIsDark = ref(false);
const chosenTheme = computed({
  get() {
    return chosenThemeIsDark.value ? 'dark' : 'light'
  },
  set(value) {
    console.log(value)
    chosenThemeIsDark.value = value === 'dark';
    colorValues.value = getThemeColors(value);
  }
});

function getThemeColors(theme: 'light' | 'dark') {
  if (theme === 'light') {
    return { ...(themeList.value.themeClubLight?.colors || themeList.value.themeInitialLight?.colors) }
  }
  return { ...(themeList.value.themeClubDark?.colors || themeList.value.themeInitialDark?.colors) }
}


const colorValues = ref(getThemeColors('light'));
const selectedColorType = ref<themeColor>(colorTypes[0]);
const currentColor = computed({
  get: () => {
    return colorValues.value[selectedColorType.value.value]
  },
  set(value) {
    colorValues.value[selectedColorType.value.value] = value;
  }
});

const selectedColorTypeComputed = computed({
  get() {
    return [selectedColorType.value.value];
  },
  set(value: unknown[]) {
    if (!value.length) {
      console.error('whtf?');
    }
    selectedColorType.value = colorTypes.find(item => item.value === value[0]) || colorTypes[0];
  }
})

function useThisTheme() {
  const defaultValueSources = chosenThemeIsDark.value ? themeList.value.themeInitialDark : themeList.value.themeInitialLight;
  themeList.value.tempTheme = {
    dark: chosenThemeIsDark.value,
    colors: {
      ...defaultValueSources.colors,
      ...colorValues.value,
    },
    variables: {
      ...defaultValueSources.variables
    },
  };

  theme.global.name.value = 'tempTheme';
}
</script>

<style scoped>
.color-example {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>