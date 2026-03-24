<template>
    <v-main>
        <v-container>
            <v-row>
                <v-col>
                    <div>
                        <div ref="quillToolbar"></div>
                        <div ref="quillElem"></div>
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
import Quill from 'quill';
import { defineAsyncComponent } from 'vue';
import type { Club, Loaders } from '~/types/frontend.js';


const quillElem = ref<HTMLInputElement | null>(null);
const quillToolbar = ref<HTMLInputElement | null>(null);

//todo: set real type
let quill: any = null;

let quillInitialValue: any = false;


onMounted(() => {
    console.log('mounted', quillElem, quillElem.value);
    
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
    ];

    if (quillElem.value) {
        quill = new Quill(quillElem.value, {
            modules: {
                toolbar: toolbarOptions
            },
            theme: 'snow'
        });
        quill.setContents(quillInitialValue);
        console.log('with quill')
    }
})

const quillHtml = computed(() => {
    if (quill.value) {
        return quill.value.getSemanticHTML()
    }
    return '';
});
const currentClub: Ref<Club> = useState('club');
const loaders: Ref<Loaders> = ref({
    save: false
});
const snackbar = ref(false);
const snackbarText = ref('');
getInitialValues();

async function getInitialValues() {
    const data: { text_delta: any } = await $fetch('/api/supabase/club-info', {
        query: {
            clubid: currentClub.value.id,
        }
    });
    quillInitialValue = data.text_delta;
    if (quill) {
        quill.setContents(quillInitialValue);
    }
}

async function saveToDatabase() {
    if (!quill) {
        return;
    }
    loaders.value.save = true;
    let ret: any = await $fetch('/api/supabase/club-info', {
        method: "POST",
        body: {
            club_id: currentClub.value.id,
            text_html: quill.getSemanticHTML(),
            text_delta: quill.getContents(),
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

<style>
@import "quill/dist/quill.core.css";
@import "quill/dist/quill.snow.css";
</style>