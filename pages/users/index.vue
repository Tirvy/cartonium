<template>
    <v-app>

        <v-main>
            <v-container>

                <v-row>
                    <v-col cols="12" v-for="item in fetchedCollection" :key="item.id">
                        <v-lazy min-height="100" transition="none">
                            <LibraryItem :value="item" />
                        </v-lazy>
                    </v-col>
                </v-row>

            </v-container>
        </v-main>

        <v-navigation-drawer location="right" v-model="drawerState">
            <v-container>
                <v-row>

                    <v-col sm="12">

                        <v-btn-toggle v-model="dataSourceChosen" variant="outlined" color="primary" shaped mandatory>
                            <v-btn v-for="dataSource in dataSources" :value="dataSource.apiName">
                                {{ dataSource.name }}
                            </v-btn>
                        </v-btn-toggle>
                    </v-col>
                    <v-col cols="12">

                        <v-text-field v-model="username" label="Search"></v-text-field>
                        <v-btn @click="fetchData" :loading="loading">Search</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-navigation-drawer>
    </v-app>
</template>

  
<script setup lang="ts">


const dataSources = ref([{ name: 'bgg', apiName: 'bgg' }, { name: 'tesera', apiName: 'tesera' }]);
const dataSourceChosen = ref(dataSources.value[0].apiName);
const username: Ref<string> = ref('pitusw')
const fetchedCollection: Ref<GameBoxInterface[]> = ref([])
const drawerState: Ref<boolean> = ref(true);
const loading: Ref<boolean> = ref(false);

const fetchData = async () => {
    loading.value = true;
    const ret = await $fetch(`/api/${dataSourceChosen.value}/get-user-collection`, { query: { username: username.value } })
    fetchedCollection.value = ret.map((item: any) => new GameBox(item));
    loading.value = false;
}
</script>