<template>
    <v-card v-if="!mobile && view === 'full'" :loading="loading">
        <div class="d-flex flex-no-wrap justify-start ">
            <v-avatar class="ma-3" size="180" rounded="0">
                <v-img :cover="false" height="180" :src="props.gathering.gamebox?.photoUrl"></v-img>
            </v-avatar>
            <div>
                <v-card-title>
                    {{ selfTitle }}
                </v-card-title>
                <v-card-subtitle>
                    <span class="me-4">
                        <v-icon icon="mdi-clock-time-two-outline" class="mr-1"></v-icon>
                        {{ date.time }}
                    </span>
                    <common-week-indicator :date="date.dateObj"></common-week-indicator>
                </v-card-subtitle>
                <v-card-text>
                    <div class="mb-2">
                        Участники ({{ slots }}):
                    </div>
                    <p v-for="guest in props.gathering.guests" :key="guest.imageUrl" class="mb-2">
                        <user-avatar :value="guest" class="mb-1 select-none"></user-avatar>
                        <span class="ms-2">{{ guest.title }}</span>
                        <nuxt-link v-if="guest.telegramUsername" :to="guest.telegramLink" class="user-link">
                            @{{ guest.telegramUsername }}
                        </nuxt-link>
                        <span v-if="guest.totalGuests > 1">+ {{ guest.totalGuests - 1 }}</span>
                    </p>
                </v-card-text>
                <v-card-text>
                    <td>{{ props.gathering.commentOwner }}</td>
                </v-card-text>
            </div>
        </div>
        <v-card-actions v-if="user?.id">
            <v-btn @click="emit('guestSet', props.gathering.id, 1)" :disabled="!gatheringComputedValue.canJoin">
                Присоединиться
            </v-btn>
            <v-btn @click="emit('showDialogGuests', props.gathering)"
                :disabled="!props.gatheringComputedValue.canAddGuests && !props.gatheringComputedValue.hasMyGuests">
                {{ props.gatheringComputedValue.hasMyGuests ? 'Изменить гостей' : 'Добавить гостей' }}
            </v-btn>
            <v-btn @click="emit('guestSet', props.gathering.id, 0)" :disabled="!props.gatheringComputedValue.canLeave">
                Покинуть сбор
            </v-btn>
            <v-spacer />

            <v-menu v-if="iAmTheOwner" location="bottom end">
                <template v-slot:activator="{ props }">
                    <v-card-actions>
                        <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                    </v-card-actions>
                </template>

                <v-list>
                    <v-list-item>
                        <v-btn @click="emit('edit')">
                            Редактировать
                        </v-btn>
                    </v-list-item>
                    <v-list-item>
                        <v-btn @click="emit('remove')">
                            Удалить
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card-actions>
    </v-card>


    <v-card v-if="mobile && view === 'full'" :loading="loading">
        <div class="d-flex flex-no-wrap justify-start ">
            <v-avatar class="ma-0" size="150" rounded="0">
                <v-img :cover="false" height="150" :src="props.gathering.gamebox?.photoUrl"></v-img>
            </v-avatar>
            <v-card-actions v-if="user?.id" class="flex-column">
                <v-container class="pa-0">
                    <v-row dense class="flex-column">
                        <v-col cols="12">
                            <v-btn variant="outlined" @click="emit('guestSet', props.gathering.id, 1)"
                                :disabled="!gatheringComputedValue.canJoin">
                                Присоединиться
                            </v-btn>
                        </v-col>
                        <v-col cols="12">
                            <v-btn variant="outlined" @click="emit('showDialogGuests', props.gathering)"
                                :disabled="!props.gatheringComputedValue.canAddGuests && !props.gatheringComputedValue.hasMyGuests">
                                {{ props.gatheringComputedValue.hasMyGuests ? 'Изменить гостей' : 'Добавить гостей' }}
                            </v-btn>
                        </v-col>
                        <v-col cols="12">
                            <v-btn variant="outlined" @click="emit('guestSet', props.gathering.id, 0)"
                                :disabled="!props.gatheringComputedValue.canLeave">
                                Покинуть сбор
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </div>
        <div>
            <v-card-title class="title-minimizer">
                {{ selfTitle }}
                ({{ slots }})
            </v-card-title>
            <v-card-subtitle>
                [{{ date.full }}]
            </v-card-subtitle>
            <div class="d-flex justify-space">
                <v-card-text>
                    <div v-for="guest in props.gathering.guests" :key="guest.imageUrl" class="mb-2">
                        <user-avatar :value="guest" class="mb-1 select-none"></user-avatar>
                        <span class="ms-1">{{ guest.title }}</span>
                        <nuxt-link v-if="guest.telegramUsername" :to="guest.telegramLink" class="user-link">
                            @{{ guest.telegramUsername }}
                        </nuxt-link>

                        <span v-if="guest.totalGuests > 1"> + {{ guest.totalGuests - 1 }}</span>
                    </div>
                </v-card-text>
                <div>

                    <v-menu v-if="iAmTheOwner" location="bottom end">

                        <template v-slot:activator="{ props }">
                            <v-card-actions>
                                <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                            </v-card-actions>
                        </template>

                        <v-list>
                            <v-list-item>
                                <v-btn @click="emit('edit')">
                                    Редактировать
                                </v-btn>
                            </v-list-item>
                            <v-list-item>
                                <v-btn @click="emit('remove')">
                                    Удалить
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>

            </div>
            <v-card-text v-if="props.gathering.commentOwner">
                <v-textarea v-model="props.gathering.commentOwner" auto-grow readonly label="Комментарий хоста"
                    rows="1"></v-textarea>
            </v-card-text>
        </div>
    </v-card>


    <v-card v-if="!mobile && view === 'compact'" :loading="loading">
        <div class="d-flex flex-no-wrap justify-start ">
            <v-avatar class="ma-3" size="180" rounded="0">
                <v-img :cover="false" height="180" :src="props.gathering.gamebox?.photoUrl"></v-img>
            </v-avatar>
            <div>
                <nuxt-link :to="linkToItem" class="title-link">
                    <v-card-title>
                        {{ selfTitle }} ({{ slots }})
                        <v-icon icon="mdi-open-in-new" size="20" color="accent"></v-icon>
                    </v-card-title>
                </nuxt-link>
                <v-card-subtitle>
                    [{{ date.full }}]
                </v-card-subtitle>
                <v-card-text>
                    <p v-for="guest in props.gathering.guests" :key="guest.imageUrl" class="mb-2">
                        <user-avatar :value="guest" class="mb-1 select-none"></user-avatar>
                        <span class="ms-2">{{ guest.title }}</span>
                        <nuxt-link v-if="guest.telegramUsername" :to="guest.telegramLink" class="user-link">
                            @{{ guest.telegramUsername }}
                        </nuxt-link>
                        <span v-if="guest.totalGuests > 1">+ {{ guest.totalGuests - 1 }}</span>
                    </p>
                </v-card-text>
                <v-card-text>
                    <td>{{ props.gathering.commentOwner }}</td>
                </v-card-text>
            </div>
        </div>
        <v-card-actions v-if="user?.id">
            <v-btn @click="emit('guestSet', props.gathering.id, 1)" :disabled="!gatheringComputedValue.canJoin">
                Присоединиться
            </v-btn>
            <v-btn @click="emit('showDialogGuests', props.gathering)"
                :disabled="!props.gatheringComputedValue.canAddGuests && !props.gatheringComputedValue.hasMyGuests">
                {{ props.gatheringComputedValue.hasMyGuests ? 'Изменить гостей' : 'Добавить гостей' }}
            </v-btn>
            <v-btn @click="emit('guestSet', props.gathering.id, 0)" :disabled="!props.gatheringComputedValue.canLeave">
                Покинуть сбор
            </v-btn>
            <v-spacer />

            <v-menu v-if="iAmTheOwner" location="bottom end">

                <template v-slot:activator="{ props }">
                    <v-card-actions>
                        <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                    </v-card-actions>
                </template>

                <v-list>
                    <v-list-item>
                        <v-btn @click="emit('edit')">
                            Редактировать
                        </v-btn>
                    </v-list-item>
                    <v-list-item>
                        <v-btn @click="emit('remove')">
                            Удалить
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card-actions>
    </v-card>
    <v-card v-if="mobile && view === 'compact'" :loading="loading">
        <div class="d-flex flex-no-wrap justify-start ">
            <v-avatar class="ma-0" size="150" rounded="0">
                <v-img :cover="false" height="150" :src="props.gathering.gamebox?.photoUrl"></v-img>
            </v-avatar>
            <v-card-actions v-if="user?.id" class="flex-column">
                <v-container class="pa-0">
                    <v-row dense class="flex-column">
                        <v-col cols="12">
                            <v-btn variant="outlined" @click="emit('guestSet', props.gathering.id, 1)"
                                :disabled="!gatheringComputedValue.canJoin">
                                Присоединиться
                            </v-btn>
                        </v-col>
                        <v-col cols="12">
                            <v-btn variant="outlined" @click="emit('showDialogGuests', props.gathering)"
                                :disabled="!props.gatheringComputedValue.canAddGuests && !props.gatheringComputedValue.hasMyGuests">
                                {{ props.gatheringComputedValue.hasMyGuests ? 'Изменить гостей' : 'Добавить гостей' }}
                            </v-btn>
                        </v-col>
                        <v-col cols="12">
                            <v-btn variant="outlined" @click="emit('guestSet', props.gathering.id, 0)"
                                :disabled="!props.gatheringComputedValue.canLeave">
                                Покинуть сбор
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </div>
        <div>
            <nuxt-link :to="linkToItem" class="title-link">
                <v-card-title class="title-minimizer">
                    {{ selfTitle }}
                    ({{ slots }})
                    <v-icon icon="mdi-open-in-new" size="20" color="accent"></v-icon>
                </v-card-title>
            </nuxt-link>
            <v-card-subtitle>
                [{{ date.full }}]
            </v-card-subtitle>
            <div class="d-flex justify-space">
                <v-card-text>
                    <div v-for="guest in props.gathering.guests" :key="guest.imageUrl" class="mb-2">
                        <user-avatar :value="guest" class="mb-1 select-none"></user-avatar>
                        <span class="ms-1">{{ guest.title }}</span>
                        <nuxt-link v-if="guest.telegramUsername" :to="guest.telegramLink" class="user-link">
                            @{{ guest.telegramUsername }}
                        </nuxt-link>

                        <span v-if="guest.totalGuests > 1"> + {{ guest.totalGuests - 1 }}</span>
                    </div>
                </v-card-text>
                <div>

                    <v-menu v-if="iAmTheOwner" location="bottom end">

                        <template v-slot:activator="{ props }">
                            <v-card-actions>
                                <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                            </v-card-actions>
                        </template>

                        <v-list>
                            <v-list-item>
                                <v-btn @click="emit('edit')">
                                    Редактировать
                                </v-btn>
                            </v-list-item>
                            <v-list-item>
                                <v-btn @click="emit('remove')">
                                    Удалить
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>

            </div>
            <v-card-text v-if="props.gathering.commentOwner">
                <v-textarea v-model="props.gathering.commentOwner" auto-grow readonly label="Комментарий хоста"
                    rows="1"></v-textarea>
            </v-card-text>
        </div>
    </v-card>
    <v-card v-if="view === 'minimal'" :loading="loading">
        <div class="d-flex flex-no-wrap justify-start">
            <div>
                <v-avatar class="ma-3" size="50" rounded="0">
                    <v-img :cover="false" height="50" :src="props.gathering.gamebox?.photoUrl"></v-img>
                </v-avatar>
            </div>
            <div>
                <v-card-subtitle class="pt-2">
                    {{ date.short }}
                    <span v-if="gatheringComputedValue.myGuests">
                        <v-icon icon="mdi-checkbox-marked-circle-outline" class="ml-6" color="success"
                            size="16"></v-icon>
                        Вы записаны
                        <span v-if="gatheringComputedValue.myGuests > 1">
                            (+ {{ gatheringComputedValue.myGuests - 1 }} ваш(их) гост(ь/ей))
                        </span>
                    </span>
                </v-card-subtitle>
                <nuxt-link :to="linkToItem" class="title-link">
                    <v-card-title class="pt-0 title-minimizer">
                        {{ selfTitle }}
                        ({{ slots }})
                        <v-icon icon="mdi-open-in-new" size="20" color="accent"></v-icon>
                    </v-card-title>
                </nuxt-link>
            </div>
            <v-spacer></v-spacer>
            <div>
                <v-menu v-if="user?.id" location="bottom end">

                    <template v-slot:activator="{ props }">
                        <v-card-actions>
                            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                        </v-card-actions>
                    </template>

                    <v-list>
                        <v-list-item>
                            <v-btn @click="emit('guestSet', props.gathering.id, 1)"
                                :disabled="!gatheringComputedValue.canJoin">
                                Присоединиться
                            </v-btn>
                        </v-list-item>
                        <v-list-item>
                            <v-btn @click="emit('showDialogGuests', props.gathering)"
                                :disabled="!props.gatheringComputedValue.canAddGuests && !props.gatheringComputedValue.hasMyGuests">
                                {{ props.gatheringComputedValue.hasMyGuests ? 'Изменить гостей' : 'Добавить гостей'
                                }}
                            </v-btn>
                        </v-list-item>
                        <v-list-item>
                            <v-btn @click="emit('guestSet', props.gathering.id, 0)"
                                :disabled="!props.gatheringComputedValue.canLeave">
                                Покинуть сбор
                            </v-btn>
                        </v-list-item>

                        <template v-if="iAmTheOwner">
                            <v-divider class="mt-1 mb-1" />
                            <v-list-item>
                                <v-btn @click="emit('edit')">
                                    Редактировать
                                </v-btn>
                            </v-list-item>
                            <v-list-item>
                                <v-btn @click="emit('remove')">
                                    Удалить
                                </v-btn>
                            </v-list-item>
                        </template>
                    </v-list>
                </v-menu>
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">

import { useDisplay } from 'vuetify'
const { mobile } = useDisplay();
const user = useSupabaseUser();
const currentClub: Ref<Club | null> = useState('club');

const props = defineProps<{
    loading: boolean,
    gathering: GatheringWithGuests
    gatheringComputedValue: GatheringComputedValue
    view: 'minimal' | 'compact' | 'full'
}>();

const emit = defineEmits<{
    (e: 'guestSet', id: number, number: number): void
    (e: 'showDialogGuests', gathering: Gathering): void
    (e: 'edit'): void
    (e: 'remove'): void
}>()

const selfTitle = computed(() => {
    return props.gathering.gamebox.title || props.gathering.ownTitle
});
const slots = computed(() => {
    return `${props.gathering.slotsFilled}/${props.gathering.guestsMax}`
});

const iAmTheOwner = computed(() => {
    return props.gathering.ownerId === user.value?.id
})

const linkToItem = computed(() => {
    return `/clubs/${currentClub.value?.urlName}/gatherings/table/${props.gathering.id}`
})

// -- date calculation start
const dayjs = useDayjs()
const date = computed(() => {
    const value = dayjs(props.gathering.startDate);
    const time = value.format('HH:mm');
    return {
        time,
        full: `${time}, ${value.format('dddd, D MMMM')}`,
        short: `${time} | ${value.format('D MMM')}`,
        dateObj: new Date(value.toISOString()),
    }
})
// -- date calculation end

</script>

<style scoped>
.title-minimizer {
    white-space: normal;
    line-height: 1.2;
}

.title-link {
    opacity: 0.85;
    text-decoration: none;
    color: inherit;
}

.title-link:hover {
    opacity: 1;
}

.user-link {
    text-decoration: none;
    color: #0088cc;
}

.user-link:hover {
    text-decoration: underline;
}

.link-icon {
    opacity: 0.8;
}

.select-none {
    user-select: none;
}
</style>