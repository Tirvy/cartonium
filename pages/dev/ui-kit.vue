<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col>

          <table>
            <tr>
              <td v-for="variant in buttonVaritants">
                {{ variant }}
              </td>

            </tr>
            <tr>
              <td v-for="variant in buttonVaritants">
                <v-btn :variant="variant">котики</v-btn>
              </td>
            </tr>
          </table>
        </v-col>
      </v-row>

    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
const buttonVaritants = ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'] as const;
</script>

<style scoped></style>