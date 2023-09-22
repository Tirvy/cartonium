<template>
    <v-app>

        <v-main>

            <v-row>
                <v-col cols="12" v-for="item in fetchedCollection" :key="item.id">
                    <v-card>
                        <div class="d-flex flex-no-wrap justify-start ">
                            <v-avatar class="ma-3" size="100" rounded="0">
                                <v-img :src="item.computed.photoUrl"></v-img>
                            </v-avatar>
                            <v-card-item class="flex-0-1" style="min-width: 0;">
                                <v-card-title>
                                    {{ item.computed.title }}
                                </v-card-title>
                            </v-card-item>
                        </div>

                    </v-card>
                </v-col>
            </v-row>
        </v-main>


        <v-navigation-drawer location="right" v-model="drawerState">
            <v-row>

                <v-col sm="12">

                    <v-btn-toggle v-model="dataSourceChosen" color="primary" variant="text">
                        <v-btn v-for="dataSource in dataSources" :value="dataSource.apiName">
                            {{ dataSource.name }}
                        </v-btn>
                    </v-btn-toggle>
                </v-col>
                <v-col cols="12">

                    <v-text-field v-model="username" label="Search"></v-text-field>
                    <v-btn @click="fetchData">Search</v-btn>
                </v-col>
            </v-row>
        </v-navigation-drawer>

        <v-footer app color="grey" height="44">
        </v-footer>
    </v-app>
</template>

  
<script setup lang="ts">

const dataSources = ref([{ name: 'bgg', apiName: 'bgg' }, { name: 'tesera', apiName: 'tesera' }]);
const dataSourceChosen = ref(dataSources.value[0].apiName);
const username: Ref<string> = ref('tirvy')
const fetchedCollection: Ref<GameBoxInterface[]> = ref([])
const drawerState: Ref<boolean> = ref(true);

const fetchData = async () => {
    const ret = await $fetch(`/api/${dataSourceChosen.value}/get-user-collection`, { query: { username: username.value } })
    fetchedCollection.value = ret.map((item: any) => new GameBox(item));
}
</script>