<template>
    <ion-grid>
        <ion-row>
            <img v-show="imageLoaded" @load="onLoad" class="banner__image" alt="Silhouette of mountains" :src="image" />
            <ion-row v-if="!imageLoaded" class="image-loading__wrapper">
                <ion-col class="image-loading__placeholder"></ion-col>
            </ion-row>
        </ion-row>
    </ion-grid>
    <ion-grid class="eventlist">
        <ion-row class="scrollable-row">
            <ion-col>
                <ion-button :fill="activeButton === 99 ? 'solid' : 'outline'" color="primary" @click="setActive(99)">
                    All
                </ion-button>

                <ion-button v-for="restaurant in restaurants" :key="restaurant.id"
                    :fill="activeButton === restaurant.id ? 'solid' : 'outline'" color="primary"
                    @click="setActive(restaurant.id)">
                    {{ restaurant?.name }}
                </ion-button>
            </ion-col>
        </ion-row>
        <ion-row class="eventlist__list">
            <ion-col class="eventlist__item" v-for="event in eventList" :key="event?.id">
                <router-link :to="{ name: 'event', params: { id: event?.id } }" class="eventlist__detail-link">
                    <ion-card class="eventlist__card">
                        <img v-show="imageLoadedMultiple.get(event.id)" @load="onLoad(event.id)" alt="Silhouette of mountains" class="eventlist__image"
                            :src="event.image ? baseUrl + 'storage/' + event?.image?.url : 'https://ionicframework.com/docs/img/demos/card-media.png'" />
                        <ion-row v-if="!imageLoadedMultiple.get(event.id)" class="image-loading__wrapper">
                            <ion-col class="image-loading__placeholder"></ion-col>
                        </ion-row>
                        <ion-card-header class="eventlist__card-header">
                            <ion-card-title class="eventlist__card-title">{{ event?.name }}</ion-card-title>
                        </ion-card-header>

                        <ion-card-content class="eventlist__card-content">
                            <ion-list lines="none">
                                <ion-item>
                                    <ion-icon class="eventlist__card-icon" aria-hidden="true" :icon="location"
                                        slot="start"></ion-icon>
                                    <ion-label class="eventlist__card-label">{{ event?.restaurant?.name }}</ion-label>
                                </ion-item>
                                <ion-item>
                                    <ion-icon class="eventlist__card-icon" aria-hidden="true" :icon="calendar"
                                        slot="start"></ion-icon>
                                    <ion-label class="eventlist__card-label">{{ formatDate(event?.date_start)
                                    }}</ion-label>
                                </ion-item>
                            </ion-list>
                        </ion-card-content>
                    </ion-card>
                </router-link>
            </ion-col>
        </ion-row>
    </ion-grid>
</template>

<script setup lang="ts">
import {
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonLabel,
    IonList,
    IonItem
} from '@ionic/vue';
import { calendar, location } from 'ionicons/icons';
import { PropType, onMounted, ref } from 'vue';
import axios from 'axios';

// Reactive state for active button
const activeButton = ref(99);

// Method to change active button
const setActive = (zone: number) => {
    activeButton.value = zone;
    getEvents(zone);
};
interface Event {
    id: number;
    name: string;
    date_start: string;
    description: string;
    rules: string;
    restaurant_id: string | null;
    restaurant: Restaurant | null
    image: Image | null
    created_at: string;
    updated_at: string;
}
interface Restaurant {
    id: number;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
}
interface Image {
    id: number;
    url: string;
}

defineProps({
    events: {
        type: Array as PropType<Event[]>,
        required: true
    }
});
const baseUrl = ref(import.meta.env.VITE_APP_BASE);
const restaurants = ref<Restaurant[]>([]);
const eventList = ref<Event[]>([]);
const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = new Intl.DateTimeFormat("en", { month: "long" }).format(dateObj);
    const weekday = new Intl.DateTimeFormat("en", { weekday: "long" }).format(dateObj);

    return `${day} ${month} - ${weekday}`;
};

const image = ref('')
const settings = async () => {
    try {
        const response = await axios.get(import.meta.env.VITE_APP_ENDPOINT + 'settings/data', {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.data && response.data.image) {
            image.value = import.meta.env.VITE_APP_BASE + 'storage/' + response.data.image.value;
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
};

const getEvents = async (restaurant = 99) => {
    try {
        eventList.value = [];
        const response = await axios.get(`${import.meta.env.VITE_APP_ENDPOINT}event?restaurant=${restaurant}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Reset imageLoaded state for new events
        imageLoadedMultiple.value.clear();

        // Loop through the events and mark the ones that need to be loaded
        response.data.events.forEach((event:Event) => {
            imageLoadedMultiple.value.set(event.id, false);
        });

        eventList.value = response.data.events;
        restaurants.value = response.data.restaurants;
    } catch (error) {
        console.error('Error fetching events:', error);
    }
};

const imageLoadedMultiple = ref<Map<number, boolean>>(new Map());
const imageLoaded = ref(false);

function onLoad(item:any) {
    if (typeof item === 'number') {
        imageLoadedMultiple.value.set(item, true);
    } else {
        imageLoaded.value = true;
    }
}

onMounted(() => {
    settings();
    getEvents()
})
</script>

<style lang="css">
.scrollable-row {
    display: flex;
    overflow-x: auto;
    padding: 10px 0;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollable-row::-webkit-scrollbar {
    display: none;
}

.scrollable-row ion-col {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    white-space: nowrap;
}

ion-button {
    flex-shrink: 0;
}

.banner__image {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
}
</style>