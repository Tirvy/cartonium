<template>
    <v-main>
        <v-container>
            <v-row>
                <v-col>
                    <div>
                        <client-only fallback-tag="div" fallback="Loading editor...">
                            <QuillEditor theme="snow" contentType="html" v-model:content="quillHtml" />
                        </client-only>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn :loading="loaders.save" @click="saveToDatabase">
                        Сохранить
                    </v-btn>
                </v-col>

            </v-row>
        </v-container>
    </v-main>

    <v-snackbar v-model="snackbar" multi-line>
        {{ snackbarText }}

        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="snackbar = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import type { Club, Loaders } from '~/types/frontend.js';

const quillHtml = ref('');
const currentClub: Ref<Club> = useState('club');
const loaders: Ref<Loaders> = ref({
    save: false
});
const snackbar = ref(false);
const snackbarText = ref('');
getInitialValues();


async function getInitialValues() {
    const data: { text_html: string } = await $fetch('/api/supabase/club-info', {
        query: {
            clubid: currentClub.value.id,
        }
    });
    quillHtml.value = data.text_html;
}

async function saveToDatabase() {
    loaders.value.save = true;
    let ret: any = await $fetch('/api/supabase/club-info', {
        method: "POST",
        body: {
            club_id: currentClub.value.id,
            text_html: quillHtml.value,
        }
    });
    loaders.value.save = false;

    snackbarText.value = 'Изменения сохранены';
    snackbar.value = true;
}

</script>

<style scoped lang="css">
:deep(.ql-editor) {
    min-height: 200px;
}

:deep(.ql-toolbar.ql-snow) {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

:deep(.ql-container.ql-snow) {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
</style>