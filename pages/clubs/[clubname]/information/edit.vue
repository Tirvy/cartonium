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
                    <v-btn @click="saveToDatabase">
                        Сохранить
                    </v-btn>
                </v-col>

            </v-row>
        </v-container>
    </v-main>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import type { Club } from '~/types/frontend.js';

const quillHtml = ref('');
const currentClub: Ref<Club> = useState('club');
getInitialValues();


async function getInitialValues() {
    const data: {text_html: string} = await $fetch('/api/supabase/club-info', {
        query: {
            clubid: currentClub.value.id,
        }
    });
    quillHtml.value = data.text_html;
}

async function saveToDatabase() {

    let ret: any = await $fetch('/api/supabase/club-info', {
        method: "POST",
        body: {
            club_id: currentClub.value.id,
            text_html: quillHtml.value,
        }
    });
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