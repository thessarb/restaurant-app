<template>
    <ion-grid>
        <ion-row>
            <ion-col size="12">
                <ion-card class="default-bg">
                    <img v-if="props.event?.image" alt="Silhouette of mountains"
                        :src="event.image ? baseUrl + 'storage/' + event?.image?.url : 'https://ionicframework.com/docs/img/demos/card-media.png'" />
                    <img v-else alt="Silhouette of mountains"
                        src="https://ionicframework.com/docs/img/demos/card-media.png" />
                    <ion-card-header>
                        <ion-card-title>{{ props.event?.name }}</ion-card-title>
                        <ion-card-subtitle></ion-card-subtitle>
                    </ion-card-header>

                    <ion-card-content>
                        {{ props.event?.description }}
                    </ion-card-content>
                </ion-card>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-col>
                <ion-list lines="none">
                    <a target="_blank" :href="event.restaurant?.locationOutline">
                        <ion-item class="default-bg">
                            <ion-icon aria-hidden="true" :icon="locationOutline" slot="start"></ion-icon>
                            <ion-label>{{ event.restaurant?.name }}</ion-label>
                        </ion-item>
                    </a>
                    <ion-item class="default-bg">
                        <ion-icon aria-hidden="true" :icon="calendarOutline" slot="start"></ion-icon>
                        <ion-label>{{ formatDate(event?.date_start) }}</ion-label>
                    </ion-item>
                    <ion-item class="default-bg">
                        <ion-icon aria-hidden="true" :icon="alarmOutline" slot="start"></ion-icon>
                        <ion-label>Starts at {{ formatTime(event?.date_start) }}</ion-label>
                    </ion-item>
                    <ion-item class="default-bg" v-if="event?.rules">
                        <ion-icon aria-hidden="true" :icon="documentOutline" slot="start"></ion-icon>
                        <ion-label>Rules: {{ event?.rules }}</ion-label>
                    </ion-item>
                    <ion-item class="default-bg" v-if="event?.description">{{ event?.description }}</ion-item>
                </ion-list>
            </ion-col>
        </ion-row>
    </ion-grid>
    <router-link v-if="props.event" :to="{ name: 'reservetype', params: { id: props.event?.id } }">
        <ion-button class="ion-padding" expand="block">Reserve</ion-button>
    </router-link>
    <!-- <ReservationDialog :event="event"/> -->
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton
} from '@ionic/vue';
import { alarmOutline, calendarOutline, documentOutline, locationOutline } from 'ionicons/icons';
const baseUrl = ref(import.meta.env.VITE_APP_BASE);

const props = defineProps({
    event: {
        type: Object,
        default: () => ({ id: null })
    }
});

const formatDate = (dateString: string | undefined) => {
    // Ensure the dateString is in a valid format
    if (!dateString) return '01 January - Monday';
    const dateObj = new Date(dateString);

    const day = dateObj.getDate();
    const month = new Intl.DateTimeFormat("en", { month: "long" }).format(dateObj);
    const weekday = new Intl.DateTimeFormat("en", { weekday: "long" }).format(dateObj);

    return `${day} ${month} - ${weekday}`;
};

const formatTime = (dateString: string | undefined): string => {
    if (!dateString) return '00:00';

    const dateObj = new Date(dateString.replace(' ', 'T')); // Convert to ISO format

    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
};
</script>

<style lang="css">
ion-button {
    flex-shrink: 0;
}
</style>